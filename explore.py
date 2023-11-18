import re

from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import psycopg2
import logging
import os
# <<<<<<< HEAD


# using flask_restful
from flask import Flask, jsonify, request, make_response
from flask_restful import Resource, Api
import psycopg2
import json

# creating the flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Adjust origins as needed
# creating an API object
api = Api(app)


# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
class ValidateDBConnection(Resource):

    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):

        response = jsonify({'message': 'Use Post to send SQL'})
        response.status_code = 400
        return response

    # Corresponds to POST request
    def post(self):
        requestJSON = request.get_json()  # status code
        dbHostIP =  requestJSON.get("dbHostIP")
        dbPort = requestJSON.get("dbPort")
        dbName   = requestJSON.get("dbName")
        dbUser   = requestJSON.get("dbUser")
        dbPassword = requestJSON.get("dbPassword")

        # Establish the connection
        try:
            conn = psycopg2.connect(
                database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
            )
            with open("authDetails.json", "w") as outfile:
                json.dump(requestJSON, outfile)
        except Exception as err:
            response = jsonify({'DbConnection': 'Failed : ' + str(err)})
            response.status_code = 400
            return response

        cursor = conn.cursor()

        # We need a type defintiionc "TableBlockTuple". If authentication is successful then create type. Ignore if it fails with exception
        try:
            cursor.execute("CREATE TYPE TableBlockTuple AS ( block text ,tupleCount text )")
        except Exception as err:
            if not str(err).find("already exists"):
                response = jsonify({'message': str(err)})
                response.status_code = 400
                return response
        conn.commit()
        #
        tableSchema = requestJSON.get("tableSchema")
        if tableSchema is None:
            response = jsonify({'DbConnection': 'Successful'})
            # response.status_code = 200
            return response
        #
        #create a temp table and select pg_relation_size and that should give the block size info
        blockSizeSQL = "CREATE TEMP TABLE tempBlkSize AS SELECT 1 AS id;SELECT pg_relation_size('pg_temp.tempBlkSize');"
        try:
            cursor.execute(blockSizeSQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        blockSize = str(cursor.fetchall()[0][0])

        GetAllTablesSQL = "SELECT table_name FROM information_schema.tables  WHERE table_schema = '" + tableSchema + "'"
        try :
            cursor.execute(GetAllTablesSQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        tableList = cursor.fetchall()

        maxTuplesPerBlockSQL = "select json_agg(row_to_json(blocktuple)) from 	("
        for tabix, table in enumerate(tableList):
            maxTuplesPerBlockSQL += "select '" + table[0] + "' as tableName ,"  + blockSize + " * count(*) / sum(pg_column_size(t)) as maxTuples from " + tableSchema + "." + table[0] + " t"
            if tabix < len(tableList) - 1 :
                maxTuplesPerBlockSQL += " union "
        maxTuplesPerBlockSQL +=  ")  blocktuple"
        cursor.execute(maxTuplesPerBlockSQL)
        response = cursor.fetchall()[0]
        # return response
        # changed Format from array to json
        # print(response)
        maxTuplesJson = dict()
        for x in response[0]:
            maxTuplesJson[x['tablename']] = x['maxtuples']
        return maxTuplesJson



# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
class ExplainService(Resource):
    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):

        response = jsonify({'message': 'Use Post to send SQL'})
        response.status_code = 400
        return response

    # Corresponds to POST request
    def post(self):
        requestJSON = request.get_json()  # status code
        querySQL = requestJSON.get("sql")
        if querySQL is None:
            response = jsonify({'message': 'Send SQL in Request !!  '})
            response.status_code = 400
            return response

        f = open('authDetails.json')
        data = json.load(f)
        dbHostIP = data["dbHostIP"]
        dbPort = data["dbPort"]
        dbName = data["dbName"]
        dbUser = data["dbUser"]
        dbPassword = data["dbPassword"]
        tableSchema = data["tableSchema"]


        # dbHostIP = requestJSON.get("dbHostIP")
        # dbPort = requestJSON.get("dbPort")
        # dbName = requestJSON.get("dbName")
        # dbUser = requestJSON.get("dbUser")
        # dbPassword = requestJSON.get("dbPassword")

        explainQuerySQL = "explain (analyze, verbose, BUFFERS, FORMAT json) " + querySQL

        # Establish the connection
        try:
            conn = psycopg2.connect(
                database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
            )
        except Exception as err:
            response = jsonify({'DbConnection': 'Failed : ' + str(err)})
            response.status_code = 400
            return response

        #
        cursor = conn.cursor()
        if tableSchema is not None:
            cursor.execute("SET search_path TO " + tableSchema)

        try:
            cursor.execute(explainQuerySQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        response = cursor.fetchall()[0]

        # Reset search_path to public
        cursor.execute("SET search_path TO public")

        global nodes, tableList, predicateList, orderByList, groupByList, subplans, ignoreNodes, mainPlanProcessing, limitCount, cacheSQLs, cacheResponse, blocksSQL, blocksSQLResponse        # response.status_code = 200
        analyze(response)

        # iterate through nodes tuple for MainPlanProcessing
        ignoreNodes = ["Gather Merge", "Gather", "Hash", "Memoize"]
        subplans = ();
        limitCount = 0;
        # iterate through nodes tuple for SubPlan Processing
        for node in nodes:
            # print("Processing ", node["nodeId"])
            mainPlanProcessing = False;
            if ("Subplan Name" in node):
                # print("Processing ", node["nodeId"])
                tableList = ();
                predicateList = ();
                orderByList = ();
                groupByList = ();
                analyze_node(node);

        # iterate through nodes tuple for MainPlanProcessing
        cacheSQLs = ()
        cacheResponse = ()
        for node in nodes:
            # print("Processing ", node["nodeId"])
            tableList = ();
            predicateList = ();
            orderByList = ();
            groupByList = ();
            mainPlanProcessing = True;
            limitCount = 0;
            analyze_node(node);

            # Build ctid sql for nodes that are not be ignored
            blocksAccessedJson = "";

            # populated tbale name and alias tuples
            tableNames = ();
            tableAliases = ();
            for tabix, table in enumerate(tableList):
                tablesplit = table.split(" ")
                tableName = tablesplit[0].split(".")[1]
                tableAlias = tablesplit[1]
                tableNames += (tableName,)
                tableAliases += (tableAlias,)

            if node["Node Type"] not in ignoreNodes:
                blocksSQL = " Select json_agg(row_to_json(blocktuple)) from ( "
                tupleSQL = " Select json_agg(row_to_json(blocktuple)) from ( "
                for tabix, table in enumerate(tableList):
                    tableName = tableNames[tabix]
                    tableAlias = tableAliases[tabix]
                    blocksSQL += "select  tableName, aliasName, array_agg((blockid,tupleids)::TableBlockTuple) as blockaccessed from  ( "
                    blocksSQL += " select '" + tableName + "' as tableName, '" + tableAlias + "' as aliasName , ( (" + tableAlias + ".ctid::text::point)[0]::int ) as blockid, count(distinct ((" + tableAlias + ".ctid::text::point)[1]::int )) as tupleids"
                    blocksSQL += " from "

                    if tabix == 0:
                        tupleSQL += " select   distinct (( ?" + ".ctid::text::point)[1]::int ) as tupleid, " + "?.*"
                        tupleSQL += " from "
                    for tableix, allTable in enumerate(tableList):
                        blocksSQL += allTable
                        if tabix == 0:
                            tupleSQL += allTable
                        if tableix != len(tableList) - 1:
                            blocksSQL += ', '
                            if tabix == 0:
                                tupleSQL += ', '
                    # Add Predicates
                    addWhereClause = True
                    for predicateix, predicateVar in enumerate(predicateList):

                        # look if predicate tablealias is in our table list.. if not don't include the predicate
                        includePredicate = True
                        pOffset = 0
                        if predicateVar.find("#SUBPLAN#") < 0:  # Don't validate predicate with #SUBPLAN# marker
                            while True:
                                dotPos = predicateVar.find(".", pOffset)
                                if dotPos == -1:
                                    break
                                predstr = predicateVar[pOffset: dotPos]
                                predlst = list(re.split(r"[ (]", predstr))
                                predlstlen = len(predlst)
                                aliasname = predlst[predlstlen - 1]
                                if aliasname not in tableAliases:
                                    includePredicate = False
                                    break
                                pOffset = dotPos + 1

                        if includePredicate:
                            if addWhereClause:
                                addWhereClause = False
                                blocksSQL += ' where '
                                if tabix == 0:
                                    tupleSQL += ' where '
                            else:
                                blocksSQL += " and "
                                if tabix == 0:
                                    tupleSQL += " and "

                            if predicateVar.find("#SUBPLAN#") >= 0:  # Remove SUBPLAN Marker before adding SQL
                                # remove #SUBPLAN# marker and no need to validate predicate
                                blocksSQL += predicateVar[9:]
                                if tabix == 0:
                                    tupleSQL += predicateVar[9:]
                            else:
                                blocksSQL += predicateVar
                                if tabix == 0:
                                    tupleSQL += predicateVar
                    if tabix == 0:
                        if addWhereClause:  # Add where clause to tupleSQL if not already added
                            addWhereClause = False
                            tupleSQL += ' where '
                        else:

                            tupleSQL += " and "
                        tupleSQL += " ( (" + "?" + ".ctid::text::point)[0]::int )  = ?"  # Placeholder for extracting with block#
                        tupleSQL += ' order by 2 asc ) blocktuple'

                    blocksSQL += ' group by 3   order by 3, 4 asc '
                    if limitCount > 0:
                        blocksSQL += ' limit ' + str(limitCount)
                        if tabix == 0:
                            tupleSQL += ' limit ' + str(limitCount)

                    blocksSQL += ') group by tableName, aliasName'
                    if tabix != len(tableList) - 1:
                        blocksSQL += ' union '

                blocksSQL += ' ) blocktuple'
                node["blocksSQL"] = blocksSQL
                node["tupleSQL"] = tupleSQL

                print(node["nodeId"], " ", node["Node Type"], " *Count*  ", blocksSQL)

                sqlFoundInCache = False;
                sqlIx = 0
                for cacheIx, cacheSql in enumerate(cacheSQLs):
                    if cacheSql == blocksSQL:
                        sqlFoundInCache = True
                        sqlIx = cacheIx
                        break
                if sqlFoundInCache:
                    print(node["nodeId"], " cache hit at slot ", sqlIx)
                    node["blocksAccessed"] = cacheResponse[sqlIx]
                else:
                    try:
                        cursor.execute(blocksSQL)
                        blocksSQLResponse = cursor.fetchall()[0]
                    except Exception as err:
                        print("*Exception ", blocksSQL)
                        # response = jsonify({'message': str(err)})
                        # response.status_code = 400
                        # return response
                        blocksSQLResponse = ""
                    node["blocksAccessed"] = blocksSQLResponse
                    # print(node["nodeId"], " ", node["Node Type"], " *Tuple*  ", tupleSQL)
                    cacheSQLs += (blocksSQL,)
                    cacheResponse += (blocksSQLResponse,)
            else:
                node["blocksSQL"] = ""
                node["blocksAccessed"] = ""
                print(node["nodeId"], " ", node["Node Type"], " << Ignore Node")
        conn.close()
        return response


def analyze(execution_plan):
    global nodeCount, nodes;
    nodeCount = 0;
    nodes = ();
    root_plan = execution_plan[0][0]['Plan']
    analyze_plan(root_plan)
    return


def analyze_plan(plan):
    global nodeCount, nodes;
    nodeCount += 1
    plan["nodeId"] = nodeCount
    if 'Plans' in plan.keys():
        for sub_plan in plan['Plans']:
            analyze_plan(sub_plan)
    if plan not in nodes:
        nodes = nodes + (plan,)  # Record in the order of traversal


def analyze_node(node):
    global tableList, predicateList, orderByList, groupByList, subplans, ignoreNodes, mainPlanProcessing, limitCount, cacheSQLs

    if 'Plans' in node.keys():
        for childnode in node['Plans']:
            # print("Drilling to ", childnode["nodeId"])
            if not ("Subplan Name" in childnode and mainPlanProcessing):
                analyze_node(childnode)

    if node["Node Type"] in ignoreNodes:
        return

    if ("Relation Name" in node):
        table = node["Schema"] + "." + node["Relation Name"] + " " + node["Alias"]
        if table not in tableList:
            tableList += (table,);

    if ("Index Cond" in node):
        predicateVar = node["Index Cond"]
        if predicateVar not in predicateList:
            predicateList += (predicateVar,);

    if ("Filter" in node):
        predicateVar = node["Filter"]
        if ("Group Key") in node:
            # replace subplan query if exist
            groupbyKey = node["Group Key"][0]
            parmpos = predicateVar.find(" $")
            if parmpos > 0:
                subplanNum = int(predicateVar[parmpos + 2:parmpos + 3])
                predicateVar = predicateVar[0:parmpos + 1] + '(' + subplans[subplanNum - 1] + ')' + predicateVar[parmpos + 4:]
                buildGroupByHavingSQL = groupbyKey + ' in (select ' + groupbyKey + ' from '
                for tableix, table in enumerate(tableList):
                    buildGroupByHavingSQL += table
                    if tableix != len(tableList) - 1:
                        buildGroupByHavingSQL += ', '
                if len(predicateList) > 0:
                    buildGroupByHavingSQL += " WHERE "
                    for whereClauseIx, whereClauseVar in enumerate(predicateList):
                        buildGroupByHavingSQL += whereClauseVar
                        if whereClauseIx != len(predicateList) - 1:
                            buildGroupByHavingSQL += " and "
                buildGroupByHavingSQL += ' Group by ' + groupbyKey + ' having  ' + predicateVar + ' )) '
                predicateVar = '#SUBPLAN#' + buildGroupByHavingSQL
                predicateList += (predicateVar,)
            else:
                buildGroupByHavingSQL = groupbyKey + ' in (select ' + groupbyKey + ' from '
                for tableix, table in enumerate(tableList):
                    buildGroupByHavingSQL += table
                    if tableix != len(tableList) - 1:
                        buildGroupByHavingSQL += ', '
                if len(predicateList) > 0:
                    buildGroupByHavingSQL += " WHERE "
                    for whereClauseIx, whereClauseVar in enumerate(predicateList):
                        buildGroupByHavingSQL += whereClauseVar
                        if whereClauseIx != len(predicateList) - 1:
                            buildGroupByHavingSQL += " and "
                buildGroupByHavingSQL += ' Group by ' + groupbyKey + ' having  ' + predicateVar + ' ) '
                predicateVar = '#SUBPLAN#' + buildGroupByHavingSQL
                predicateList += (predicateVar,)

        else:
            subplanPos = predicateVar.find("SubPlan ")
            if subplanPos >= 0:
                if predicateVar.find("hashed SubPlan ") >= 0:
                    subplanPos = predicateVar.find("hashed SubPlan ")
                    # a special case where predicate with " Colum NOT IN is (Subquery)" had Filter simply represented as (NOT (hashed SubPlan 1))
                    if predicateVar.find("NOT (hashed") >= 0 :
                        subplanPos = predicateVar.find("NOT (hashed SubPlan ")
                        subplanNum = int(predicateVar[subplanPos + 20: subplanPos + 21])
                        predicateVar = '#SUBPLAN#' + "( " + node["Output"][-1] + " NOT IN " + predicateVar[0: subplanPos] + subplans[subplanNum - 1] + predicateVar[subplanPos + 21:]
                    else:
                        subplanNum = int(predicateVar[subplanPos + 15: subplanPos + 16])
                        predicateVar = '#SUBPLAN#' + predicateVar[0: subplanPos] + subplans[subplanNum - 1] + predicateVar[subplanPos + 16:]
                else:
                    subplanNum = int(predicateVar[subplanPos + 8: subplanPos + 9])
                    predicateVar = '#SUBPLAN#' + predicateVar[0: subplanPos] + subplans[subplanNum - 1] + predicateVar[subplanPos + 9:]
                predicateList += (predicateVar,);

            else:
                if predicateVar not in predicateList:
                    predicateList += (predicateVar,);

    if ("Hash Cond" in node):
        predicateVar = node["Hash Cond"]
        if predicateVar not in predicateList:
            predicateList += (predicateVar,);

    if ("Merge Cond" in node):
        predicateVar = node["Merge Cond"]
        if predicateVar not in predicateList:
            predicateList += (predicateVar,);

    if ("Sort Key" in node):
        for sortKey in node["Sort Key"]:
            if sortKey not in orderByList:
                orderByList += (sortKey,);

    if ("Join Filter" in node):
        predicateVar = node["Join Filter"]
        subplanPos = predicateVar.find("SubPlan ")
        if subplanPos >= 0:
            # subplanName = predicateVar[subplanPos: subplanPos + 10]
            subplanNum = int(predicateVar[subplanPos + 8: subplanPos + 9])
            predicateVar = '#SUBPLAN#' + predicateVar[0: subplanPos] + subplans[subplanNum - 1] + predicateVar[subplanPos + 9: ]
            predicateList += (predicateVar,)
        else:
            if predicateVar not in predicateList:
                predicateList += (predicateVar,)

    if ("Subplan Name" in node and not mainPlanProcessing):
        subplanName = node["Subplan Name"]
        subplanpos = subplanName.find("(returns $")
        if subplanpos > 0:
            subplanNum = int(subplanName[subplanpos + 10: subplanpos + 11])
        else:
            subplanNum = int(subplanName[8:])
        subplanQuery = "SELECT " + node["Output"][0] + " FROM "
        for tableix, table in enumerate(tableList):
            subplanQuery += table
            if tableix != len(tableList) - 1:
                subplanQuery += ', '
        if len(predicateList) > 0:
            subplanQuery += " WHERE "
            for whereClauseIx, whereClauseVar in enumerate(predicateList):
                subplanQuery += whereClauseVar
                if whereClauseIx != len(predicateList) - 1:
                    subplanQuery = subplanQuery + " and "

        if len(subplans) == 0 or subplanNum > len(subplans):
            subplans += (subplanQuery,)
        else:
            subplanslist = list(subplans)
            subplanslist[subplanNum - 1] = subplanQuery
            subplans = tuple(subplanslist)

    if (node["Node Type"] == "Limit"):
        limitCount = node["Actual Rows"]

    # # Aggregate node block access is already handled in child node.  Aggregation will need to access all block to aggregate
    # # Similarly Sort would have its child node demonstrate accessed block and no additional blocks are accessed. so no need to show  blocks accessed
    # if node["Node Type"] in ignoreNodesFull:
    #     return


class getBlockTuples(Resource):
    def get(self):
        response = jsonify({'message': 'Use Post to send SQL'})
        response.status_code = 400
        return response

    def post(self):
        requestJSON = request.get_json()  # status code
        BlockTupleSQL = requestJSON.get("sql")
        if BlockTupleSQL is None:
            response = jsonify({'message': 'Send SQL in Request !!  '})
            response.status_code = 400
            return response
        f = open('authDetails.json')
        data = json.load(f)
        dbHostIP = data["dbHostIP"]
        dbPort = data["dbPort"]
        dbName = data["dbName"]
        dbUser = data["dbUser"]
        dbPassword = data["dbPassword"]
        if dbHostIP is None or dbPort is None or dbName is None or dbUser is None or dbPassword is None:
            response = jsonify({'message': 'Send dbHostIP, dbPort, dbName, dbUser, dbPassword !!  '})
            response.status_code = 400
            return response
        tableName = requestJSON.get("tableName")
        aliasName = requestJSON.get("aliasName")
        blockNum = requestJSON.get("blockNum")
        if tableName is None or aliasName is None or blockNum is None:
            response = jsonify({'message': 'Send tableName, aliasName, blockNum in Request !!  '})
            response.status_code = 400
            return response
        BlockTupleSQL = BlockTupleSQL.replace("?", aliasName, 3)  # 1st, 2nd, 3rd placeholder is alias name
        BlockTupleSQL = BlockTupleSQL.replace("?", blockNum, 1)  # 4th placeholder is blockNum
        try:
            conn = psycopg2.connect(
                database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
            )
        except Exception as err:
            response = jsonify({'DbConnection': 'Failed : ' + str(err)})
            response.status_code = 400
            return response
        #
        cursor = conn.cursor()
        try:
            cursor.execute(BlockTupleSQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        response = cursor.fetchall()[0]

        return response


class getMaxTuplesPerBlock(Resource):

    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):
        response = jsonify({'message': 'Use Post to send SQL'})
        response.status_code = 400
        return response

    # Corresponds to POST request
    def post(self):
        requestJSON = request.get_json()  # status code
        tableSchema = requestJSON.get("tableSchema")
        if tableSchema is None:
            response = jsonify({'message': 'Send tableSchema in Request !!  '})
            response.status_code = 400
            return response
        f = open('authDetails.json')
        data = json.load(f)
        dbHostIP = data["dbHostIP"]
        dbPort = data["dbPort"]
        dbName = data["dbName"]
        dbUser = data["dbUser"]
        dbPassword = data["dbPassword"]
        #
        # dbHostIP = requestJSON.get("dbHostIP")
        # dbPort = requestJSON.get("dbPort")
        # dbName = requestJSON.get("dbName")
        # dbUser = requestJSON.get("dbUser")
        # dbPassword = requestJSON.get("dbPassword")
        if dbHostIP is None or dbPort is None or dbName is None or dbUser is None or dbPassword is None:
            response = jsonify({'message': 'Send dbHostIP, dbPort, dbName, dbUser, dbPassword !!  '})
            response.status_code = 400
            return response

        # Establish the connection
        try:
            conn = psycopg2.connect(
                database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
            )
        except Exception as err:
            response = jsonify({'DbConnection': 'Failed : ' + str(err)})
            response.status_code = 400
            return response

        #
        cursor = conn.cursor()
        # create a temp table and select pg_relation_size and that should give the block size info
        blockSizeSQL = "CREATE TEMP TABLE tempBlkSize AS SELECT 1 AS id;SELECT pg_relation_size('pg_temp.tempBlkSize');"
        try:
            cursor.execute(blockSizeSQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        blockSize = str(cursor.fetchall()[0][0])

        GetAllTablesSQL = "SELECT table_name FROM information_schema.tables  WHERE table_schema = '" + tableSchema + "'"
        try:
            cursor.execute(GetAllTablesSQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        tableList = cursor.fetchall()

        maxTuplesPerBlockSQL = "select json_agg(row_to_json(blocktuple)) from 	("
        for tabix, table in enumerate(tableList):
            maxTuplesPerBlockSQL += "select '" + table[
                0] + "' as tableName ," + blockSize + " * count(*) / sum(pg_column_size(t)) as maxTuples from " + tableSchema + "." + \
                                    table[0] + " t"
            if tabix < len(tableList) - 1:
                maxTuplesPerBlockSQL += " union "
        maxTuplesPerBlockSQL += ")  blocktuple"
        cursor.execute(maxTuplesPerBlockSQL)
        response = cursor.fetchall()[0]
        return response


api.add_resource(ExplainService, '/explain')
api.add_resource(getBlockTuples, '/getBlockTuples')
api.add_resource(ValidateDBConnection, '/authenticate')
api.add_resource(getMaxTuplesPerBlock, '/getMaxTuples')

# driver function
if __name__ == '__main__':
    app.run(debug=True)



