
# --------------------Modules -----------------------
import serial
import time
from Adafruit_IO import Client

import smbus
import time
from ctypes import c_short
from ctypes import c_byte
from ctypes import c_ubyte

import Adafruit_DHT
import time

import RPi.GPIO as GPIO
import time

from time import sleep
#from gpiozero import InputDevice

from firebase import firebase
# --------------------Variables---------------------------
ser = serial.Serial('/dev/ttyUSB0')


DEVICE = 0x76  # Default device I2C address
bus = smbus.SMBus(1)  # Rev 2 Pi, Pi 2 & Pi 3 uses bus 1
# Rev 1 Pi uses bus 0


sensor = Adafruit_DHT.AM2302
sensor_pin = 4

SPICLK = 11
SPIMISO = 9
SPIMOSI = 10
SPICS = 8
mq7_dpin = 37
mq7_apin = 0


#no_rain = InputDevice(26)


#db = firebase.FirebaseApplication("https://testing-91e81-default-rtdb.firebaseio.com/", None)
# ----------- Firebase Data ---------------
pmtwofive = 0
pmten = 0
Temperature = 0
Pressure = 0
Humidity = 0
temperature = 0
humidity = 0
isRain = False
# --------------------GPIO---------------------------------

# --------------------Sensors Methods ------------
def airquality():
    while True:
        data = []
        for index in range(0,10):
            datum = ser.read()
            data.append(datum)
        pmtwofive = int.from_bytes(b''.join(data[2:4]), byteorder='little') / 10
        pmten = int.from_bytes(b''.join(data[4:6]), byteorder='little') / 10
        return pmtwofive , pmten
    
    #x = str((pmtwofive))
    #data_to_upload = { 'PM2.5':x }
    #result = db.post('/Student', data_to_upload)
    #print(result)


def bme280():
    def getShort(data, index):
        return c_short((data[index+1] << 8) + data[index]).value
        # return two bytes from data as a signed 16-bit value

    def getUShort(data, index):
        return (data[index+1] << 8) + data[index]
      # return two bytes from data as an unsigned 16-bit value

    def getChar(data, index):
        result = data[index]
        if result > 127:
            result -= 256
        return result
      # return one byte from data as a signed char

    def getUChar(data, index):
        result = data[index] & 0xFF
        return result
      # return one byte from data as an unsigned char

    def readBME280ID(addr=DEVICE):
        REG_ID = 0xD0
        (chip_id, chip_version) = bus.read_i2c_block_data(addr, REG_ID, 2)
        return (chip_id, chip_version)
      # Chip ID Register Address

    def readBME280All(addr=DEVICE):
        REG_DATA = 0xF7
        REG_CONTROL = 0xF4
        REG_CONFIG = 0xF5

        REG_CONTROL_HUM = 0xF2
        REG_HUM_MSB = 0xFD
        REG_HUM_LSB = 0xFE

        # Oversample setting - page 27
        OVERSAMPLE_TEMP = 2
        OVERSAMPLE_PRES = 2
        MODE = 1

        # Oversample setting for humidity register - page 26
        OVERSAMPLE_HUM = 2
        bus.write_byte_data(addr, REG_CONTROL_HUM, OVERSAMPLE_HUM)

        control = OVERSAMPLE_TEMP << 5 | OVERSAMPLE_PRES << 2 | MODE
        bus.write_byte_data(addr, REG_CONTROL, control)

        # Read blocks of calibration data from EEPROM
        # See Page 22 data sheet
        cal1 = bus.read_i2c_block_data(addr, 0x88, 24)
        cal2 = bus.read_i2c_block_data(addr, 0xA1, 1)
        cal3 = bus.read_i2c_block_data(addr, 0xE1, 7)

        # Convert byte data to word values
        dig_T1 = getUShort(cal1, 0)
        dig_T2 = getShort(cal1, 2)
        dig_T3 = getShort(cal1, 4)

        dig_P1 = getUShort(cal1, 6)
        dig_P2 = getShort(cal1, 8)
        dig_P3 = getShort(cal1, 10)
        dig_P4 = getShort(cal1, 12)
        dig_P5 = getShort(cal1, 14)
        dig_P6 = getShort(cal1, 16)
        dig_P7 = getShort(cal1, 18)
        dig_P8 = getShort(cal1, 20)
        dig_P9 = getShort(cal1, 22)

        dig_H1 = getUChar(cal2, 0)
        dig_H2 = getShort(cal3, 0)
        dig_H3 = getUChar(cal3, 2)

        dig_H4 = getChar(cal3, 3)
        dig_H4 = (dig_H4 << 24) >> 20
        dig_H4 = dig_H4 | (getChar(cal3, 4) & 0x0F)

        dig_H5 = getChar(cal3, 5)
        dig_H5 = (dig_H5 << 24) >> 20
        dig_H5 = dig_H5 | (getUChar(cal3, 4) >> 4 & 0x0F)

        dig_H6 = getChar(cal3, 6)

        # Wait in ms (Datasheet Appendix B: Measurement time and current calculation)
        wait_time = 1.25 + (2.3 * OVERSAMPLE_TEMP) + ((2.3 *
                                                       OVERSAMPLE_PRES) + 0.575) + ((2.3 * OVERSAMPLE_HUM)+0.575)
        time.sleep(wait_time/1000)  # Wait the required time

        # Read temperature/pressure/humidity
        data = bus.read_i2c_block_data(addr, REG_DATA, 8)
        pres_raw = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
        temp_raw = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
        hum_raw = (data[6] << 8) | data[7]

        # Refine temperature
        var1 = ((((temp_raw >> 3)-(dig_T1 << 1)))*(dig_T2)) >> 11
        var2 = (((((temp_raw >> 4) - (dig_T1)) *
                  ((temp_raw >> 4) - (dig_T1))) >> 12) * (dig_T3)) >> 14
        t_fine = var1+var2
        temperature = float(((t_fine * 5) + 128) >> 8)

        # Refine pressure and adjust for temperature
        var1 = t_fine / 2.0 - 64000.0
        var2 = var1 * var1 * dig_P6 / 32768.0
        var2 = var2 + var1 * dig_P5 * 2.0
        var2 = var2 / 4.0 + dig_P4 * 65536.0
        var1 = (dig_P3 * var1 * var1 / 524288.0 + dig_P2 * var1) / 524288.0
        var1 = (1.0 + var1 / 32768.0) * dig_P1
        if var1 == 0:
            pressure = 0
        else:
            pressure = 1048576.0 - pres_raw
            pressure = ((pressure - var2 / 4096.0) * 6250.0) / var1
            var1 = dig_P9 * pressure * pressure / 2147483648.0
            var2 = pressure * dig_P8 / 32768.0
            pressure = pressure + (var1 + var2 + dig_P7) / 16.0

        # Refine humidity
        humidity = t_fine - 76800.0
        humidity = (hum_raw - (dig_H4 * 64.0 + dig_H5 / 16384.0 * humidity)) * (dig_H2 / 65536.0 *
                                                                                (1.0 + dig_H6 / 67108864.0 * humidity * (1.0 + dig_H3 / 67108864.0 * humidity)))
        humidity = humidity * (1.0 - dig_H1 * humidity / 524288.0)
        if humidity > 100:
            humidity = 100
        elif humidity < 0:
            humidity = 0

        
        return temperature/100.0, pressure/100.0, humidity
      # Register Addresses

    def main_bme280():
        (chip_id, chip_version) = readBME280ID()
        #print("Chip ID     :", chip_id)
        #print("Version     :", chip_version)

        temperature, pressure, humidity = readBME280All()
        
        
        
        print("Temperature : ", temperature, "C")
        print("Pressure : ", pressure, "hPa")
        print("Humidity : ", humidity, "%")
        return temperature, pressure
        

    temperature, pressure = main_bme280()
    return temperature, pressure


def am2301():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, sensor_pin)

    temperature_f = temperature * 9/5.0 + 32
    if humidity is not None and temperature is not None:
        # print temperature and humidity
        print('Temperature = ' + str(temperature) + ',' + 'Temperature Fahrenheit = ' +
              str(temperature_f) + ',' + 'Humidity = ' + str(humidity))
        #x = temperature
        z = humidity
        return z
        # save time, date, temperature in Celsius, temperature in Fahrenheit and humidity in .txt file
        

    else:
        print('Failed to get reading. Try again!')
        time.sleep(1)


def mq7():
    def init():
        GPIO.setwarnings(False)
        GPIO.cleanup()  # clean up at the end of your script
        GPIO.setmode(GPIO.BCM)  # to specify whilch pin numbering system
        # set up the SPI interface pins
        GPIO.setup(SPIMOSI, GPIO.OUT)
        GPIO.setup(SPIMISO, GPIO.IN)
        GPIO.setup(SPICLK, GPIO.OUT)
        GPIO.setup(SPICS, GPIO.OUT)
        GPIO.setup(mq7_dpin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    def readadc(adcnum, clockpin, mosipin, misopin, cspin):
        if ((adcnum > 7) or (adcnum < 0)):
            return -1
        GPIO.output(cspin, True)

        GPIO.output(clockpin, False)  # start clock low
        GPIO.output(cspin, False)     # bring CS low
                                                                                     
        commandout = adcnum
        commandout |= 0x18  # start bit + single-ended bit
        commandout <<= 3    # we only need to send 5 bits here
        for i in range(5):
            if (commandout & 0x80):
                GPIO.output(mosipin, True)
            else:
                GPIO.output(mosipin, False)
            commandout <<= 1
            GPIO.output(clockpin, True)
            GPIO.output(clockpin, False)

        adcout = 0
        # read in one empty bit, one null bit and 10 ADC bits
        for i in range(12):
            GPIO.output(clockpin, True)
            GPIO.output(clockpin, False)
            adcout <<= 1
            if (GPIO.input(misopin)):
                adcout |= 0x1

        GPIO.output(cspin, True)

        adcout >>= 1       # first bit is 'null' so drop it
        return adcout

    def main_mq7():
        init()
        
        
        COlevel = readadc(mq7_apin, SPICLK, SPIMOSI, SPIMISO, SPICS)

        
        if GPIO.input(mq7_dpin):
            print("CO not leak")
            
            #b = "CO not leak"
            #d = 0
            #e = 0
            #c = [b , d, e]
            #return c
        else:
           
            print("Current CO AD vaule = " +
                    str("%.2f" % ((COlevel/1024.)*5))+" V")
            print("Current CO density is:" + str("%.2f" %
                                                     ((COlevel/1024.)*100))+" %")
            #b = "CO Leak"
            d = (COlevel/1024.)*5
            e = (COlevel/1024.)*100
            #c = [d, e]
            return d,e

    d,e = main_mq7()
    return d,e


def raindropSensor():
    from gpiozero import InputDevice
    no_rain = InputDevice(26)
    if not no_rain.is_active:
        print("It's raining - get the washing in!")
        isRain = True
        a = "It's raining"
        return a
        # insert your other code or functions here
        # e.g. tweet, SMS, email, take a photo etc.
    else:
        print("It's not raining")
        a = "It's not raining"
        return a
      

def main():
    running1 = True
    
    try:
        #airquality()
        #bme280()
        #am2301()
        mq7()
        #raindropSensor()
            #data ={"PM2.5:":pmtwofive,
             #      "PM10:":pmten}
            #result = firebase.post("/",data)
            
           
    except KeyboardInterrupt:
        
        print('Program stopped')
        running1 = False
                  
   
# --------------------Main Method--------------
#if __name__ == "__main__":
#main()
      
