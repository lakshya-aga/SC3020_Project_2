
# PostgreSQL Query Plan Visualizer: 
A React based web application, a tool for PostgreSQL query visualization using Python Flask framework to understand the SQL query execution plan, memory utlized and dissect access by sub-trees. It is designed with a custom sub querying backend algorithm to identify bottlenecks in the execution plan.  

![photo_6289731459417750459_y](https://github.com/user-attachments/assets/c3021949-e736-4908-aef7-f8b4e94d2c24)

![photo_6289731459417750455_y](https://github.com/user-attachments/assets/2c15bc53-0873-476b-8ddf-403fc1be1252)



https://github.com/user-attachments/assets/0ff427f7-7b5b-472b-b66c-ad55279b03b3


# To Run Application

Create python virtual environment using and activate it (Optional)
````
python3 -m venv project2 
source project2/bin/activate
````

Install dependencies using
````
pip3 install -r requirements.txt
````

Install Node.js from https://nodejs.org/en following their instructions
Setup frontend dependencies with

```
cd interface
npm install
```

Run the backend and frontend servers using 
````
cd ..
python3 project.py
````


To test backend go to your browser and open the url
http://127.0.0.1:5000/explain


To Use the query visualisation tool go to the following link in your browser:
http://127.0.0.1:3000/login

Enter your database login details and you will be redirected to the Visualization page:

Enter your Queries such as:
```
select  l_returnflag,  l_linestatus,  sum(l_quantity) as sum_qty,  sum(l_extendedprice) as sum_base_price,  sum(l_extendedprice * (1-l_discount)) as sum_disc_price,  sum(l_extendedprice * (1-l_discount) * (1+l_tax)) as sum_charge,  avg(l_quantity) as avg_qty,  avg(l_extendedprice) as avg_price,  avg(l_discount) as avg_disc,  count(*) as count_order  from  lineitem  where  l_shipdate <= date '1998-01-12' - 90  group by  l_returnflag,  l_linestatus  order by  l_returnflag,  l_linestatus
```

# Notes:

We have assumed that you would be running your backend at port 5000, any variations to that will end up with errors in the frontend urls and therefore would require to be changed.

The loading time for some queries might be very long. This is because the backend is fetching all the data for the query including blocks and tuples in every sub query as well. The query in example will take nearly 40 seconds to visualize.

We are using subprocesses for running 2 servers with one script.
