#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include "MQ135.h"
#include <DHT.h>

// const char* ssid = "UiTiOt-E3.1";
// const char* password = "UiTiOtAP";

const char* ssid = "wifi";
const char* password = "12345678";

const char* serverName = "http://172.20.73.130/api/data";
// const char* serverName = "http://172.31.10.41/api/data";

unsigned long lastTime = 0;

unsigned long timerDelay = 5000;

//sensor
//--DHT
const int DHTPIN = 2;
const int DHTTYPE = DHT22;
DHT dht(DHTPIN, DHTTYPE);
struct dhtData {
  float temperature;
  float humidity;
};
//DUST

float dustDensity = 0;
int measurePin = 34;
int ledPower = 32;

int samplingTime = 280;
int deltaTime = 40;
int sleepTime = 9680;
//MQ135

#define PIN_MQ135 35
MQ135 mq135_sensor = MQ135(PIN_MQ135);

//TDS
#define TdsSensorPin 27
#define VREF 3.3  // analog reference voltage(Volt) of the ADC
#define SCOUNT 30

int analogBuffer[SCOUNT];  // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;

float averageVoltage = 0;
float tdsValue = 0;


//Set up
void setup() {
  Serial.begin(9600);

  //Wire.begin();
  WiFi.begin(ssid, password);
  Serial.println("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  dht.begin();
  pinMode(TdsSensorPin, INPUT);
  pinMode(ledPower, OUTPUT);

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {

  if ((millis() - lastTime) > timerDelay) {
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      //Set header
      http.addHeader("Content-Type", "application/json");
      http.addHeader("user_id", "215226482152149021522077");
      // Data to send with HTTP POST
      DynamicJsonDocument doc(1024);
      String httpRequestData;
      dhtData tem_hum = dhtRead();
      doc["temperature"] = tem_hum.temperature;
      doc["humidity"] = tem_hum.humidity;
      doc["ppm"] = mq135Read(tem_hum.temperature, tem_hum.humidity);
      doc["dust"] = dustRead();
      doc["tds"] = tdsRead();
      serializeJson(doc, httpRequestData);

      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      //Receive data from server
      // String payload = http.getString();
      // DynamicJsonDocument doc2(1024);
      // deserializeJson(doc2, payload);
      // JsonObject result = doc2.as<JsonObject>();

      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

dhtData dhtRead() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  dhtData result;
  result.temperature = t;
  result.humidity = h;
  return result;
}

float mq135Read(float temperature, float humidity) {
  float ppm = mq135_sensor.getPPM();
  return ppm;
}

float dustRead() {
  digitalWrite(ledPower, LOW);                // Bật IR LED
  delayMicroseconds(samplingTime);            //Delay 0.28ms
  float voMeasured = analogRead(measurePin);  // Đọc giá trị ADC V0
  delayMicroseconds(deltaTime);               //Delay 0.04ms
  digitalWrite(ledPower, HIGH);               // Tắt LED
  delayMicroseconds(sleepTime);               //Delay 9.68ms

  // Tính điện áp từ giá trị ADC
  float calcVoltage = voMeasured * (3.3 / 1024);  //Điệp áp Vcc của cảm biến (5.0 hoặc 3.3)

  // Linear Equation http://www.howmuchsnow.com/arduino/airquality/
  // Chris Nafis (c) 2012
  dustDensity = (0.17 * calcVoltage - 0.1) * 1000;

  return dustDensity;
}
int getMedianNum(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];
  for (byte i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0) {
    bTemp = bTab[(iFilterLen - 1) / 2];
  } else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}
float tdsRead() {
  long start = millis();
  static unsigned long analogSampleTimepoint = millis();
  static unsigned long printTimepoint = millis();
  for(short i = 0; i <= 800; i+=40){
    if (millis() - analogSampleTimepoint > 40U) {  //every 40 milliseconds,read the analog value from the ADC
      analogSampleTimepoint = millis();
      analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);  //read the analog value and store into the buffer
      analogBufferIndex++;
      if (analogBufferIndex == SCOUNT) {
        analogBufferIndex = 0;
      }
    }
    delay(40);
  }
  delay(5);
  if (millis() - printTimepoint > 800U) {
    printTimepoint = millis();
    for (copyIndex = 0; copyIndex < SCOUNT; copyIndex++) {
      analogBufferTemp[copyIndex] = analogBuffer[copyIndex];

      // read the analog value more stable by the median filtering algorithm, and convert to voltage value
      averageVoltage = getMedianNum(analogBufferTemp, SCOUNT) * (float)VREF / 4096.0;

      //temperature compensation formula: FinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
      float compensationCoefficient = 1.0 + 0.02 * (dhtRead().temperature - 25.0);
      //temperature compensation
      float compensationVoltage = averageVoltage / compensationCoefficient;
      //convert voltage value to tds value
      tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * 0.5;
    }
  }
  return tdsValue;
}