# Heartful

A *RESTful* API/ Django Web App for CPE 409 - Cloud Computing 

### Main Heartful landing page
[index/] (http://52.10.162.213)  
- GET  

### User
[user/] (http://127.0.0.1:8000/user/)  
- GET  
- POST  
{"googleid": "100",  
 "name":"NONE",  
 "heartrate": 65,  
 "spO2": 99,  
 "age": 23
}

### User uploaded data
[dataSet/] (http://52.10.162.213/dataSet)  

- GET  
dataSet/# - retrive specific dataSet
- POST  
{"googleid":"100",     
 "type":"sitting",     
 "heartrate_values":[{"value":64,     
                      "unit":"bpm",    
                      "date_time":"2009-07-24 21:45:34-07"}]  
} 

#### All user entries
[dataSet/] (http://127.0.0.1:8000/dataSet/entries/)    

- GET   
[dataSet/#] Specific user entries

### Data Types
[dataTypes/] (http://52.10.162.213/dataTypes)

- GET 

### Fitness
[fitness/] (http://127.0.0.1:8000/fitness/)

- GET  
[fitness/#] Specific user goals  

{"googleId": "100",  
 "goals": [{"id": 1,   
            "title": "Goal!",   
            "detail": "Really want this one",  
            "status": "In progress",   
            "importance": 10   
          }]  
}  

- POST  
{"googleId": "100",
 "title": "New Goal", 
 "detail": "Really want this one",  
 "status": "In progress",   
 "importance": 10   
}


### Analysis
[analysis/#] (http://52.10.162.213/analysis?age=23)

# Notes
Apache Log: /var/log/apache2/error.log
