import firebase_admin
from firebase_admin import credentials, firestore
import sensors
import time
from datetime import date

from datetime import datetime


# initialize sdk
cred = credentials.Certificate("Enter json file here!!")
firebase_admin.initialize_app(cred)
# initialize firestore instance
firestore_db = firestore.client()
while True:
    
    pmtwofive, pmten = sensors.airquality()
    temperature, pressure = sensors.bme280()
    humidity  = sensors.am2301()
#COAD, CODE = sensors.mq7()
    rain = sensors.raindropSensor()
    #....Time
    now = datetime.now()
    today = date.today()

    current_time = now.strftime("%H:%M:%S")
    print("Current Time =", current_time)

#dd/mm/YY H:M:S
    dt_string = today.strftime("%d/%m/%Y")
    print("date=", dt_string)
    firestore_db.collection(u'WeatherData').add({"Date":dt_string,"Time":current_time,'Temperature': temperature, 'Humidity': humidity, 'Pressure': pressure, 'Rain': rain, 'PMtwofive':pmtwofive, 'PMten':pmten})
    snapshots = list(firestore_db.collection(u'WeatherData').get())
    for snapshot in snapshots:
        
        print(snapshot.to_dict())      


# add data


# read data

