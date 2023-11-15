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
        dbHostIP = requestJSON.get("dbHostIP")
        dbPort = requestJSON.get("dbPort")
        dbName = requestJSON.get("dbName")
        dbUser = requestJSON.get("dbUser")
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

        #
        response = jsonify({'DbConnection': 'Successful'})
        # response.status_code = 200
        return response
        #


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
        cursor.execute("SET search_path TO tpch1g")
        try:
            cursor.execute(explainQuerySQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        response = cursor.fetchall()[0]
        cursor.execute("SET search_path TO public")
        global nodes, tableList, predicateList, orderByList, groupByList, subplans, ignoreNodes, ignoreNodesFull, mainPlanProcessing, limitCount
        analyze(response)
        ignoreNodes = ["Gather Merge", "Gather", "Hash", "Memoize"]
        ignoreNodesFull = ["Gather Merge", "Gather", "Hash", "Memoize", "Sort", "Aggregate"]
        subplans = ()
        limitCount = 0
        for node in nodes:
            mainPlanProcessing = False;
            if ("Subplan Name" in node):
                tableList = ();
                predicateList = ();
                orderByList = ();
                groupByList = ();
                analyze_node(node);
        for node in nodes:
            tableList = ();
            predicateList = ();
            orderByList = ();
            groupByList = ();
            mainPlanProcessing = True;
            limitCount = 0;
            analyze_node(node);
            blocksAccessedJson = "";
            tableNames = ();
            tableAliases = ();
            for tabix, table in enumerate(tableList):
                tablesplit = table.split(" ")
                tableName = tablesplit[0].split(".")[1]
                tableAlias = tablesplit[1]
                tableNames += (tableName,)
                tableAliases += (tableAlias,)
            if node["Node Type"] not in ignoreNodesFull:
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
                    addWhereClause = True
                    for predicateix, predicateVar in enumerate(predicateList):
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
                try:
                    print(blocksSQL)
                    cursor.execute(blocksSQL)
                except Exception as err:
                    response = jsonify({'message': str(err)})
                    response.status_code = 400
                    return response
                blocksSQLResponse = cursor.fetchall()[0]
                node["blocksAccessed"] = blocksSQLResponse
                print(node["nodeId"], " ", node["Node Type"], " *Count*  ", blocksSQL)
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
    global tableList, predicateList, orderByList, groupByList, subplans, ignoreNodes, ignoreNodesFull, mainPlanProcessing, limitCount
    if 'Plans' in node.keys():
        for childnode in node['Plans']:
            if (
                    "Subplan Name" in node and mainPlanProcessing):  # Subplan query is already built.. so no need to traverse subplan tree
                break
            else:
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
            subplanNum = int(predicateVar[subplanPos + 8: subplanPos + 9])
            predicateVar = '#SUBPLAN#' + predicateVar[0: subplanPos] + subplans[subplanNum - 1] + predicateVar[
                                                                                                  subplanPos + 9:]
            predicateList += (predicateVar,);
    if ("Subplan Name" in node and not mainPlanProcessing):
        subplanName = node["Subplan Name"]
        subplanNum = int(subplanName[8:])
        subplanQuery = "SELECT " + node["Output"][0] + " FROM "
        for tableix, table in enumerate(tableList):
            subplanQuery += table
            if tableix != len(tableList) - 1:
                subplanQuery += ', '
        if len(predicateList) >= 0:
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
    if node["Node Type"] in ignoreNodesFull:
        return


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
            response.status_code = 410
            return response
        response = cursor.fetchall()[0]

        return response


api.add_resource(ExplainService, '/explain')
api.add_resource(getBlockTuples, '/getBlockTuples')
api.add_resource(ValidateDBConnection, '/authenticate')

# driver function
if __name__ == '__main__':
    app.run(debug=True)
