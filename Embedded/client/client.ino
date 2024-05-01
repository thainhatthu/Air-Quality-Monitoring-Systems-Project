#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include "MQ135.h"
#include <DHT.h>
#include "SharpGP2Y10.h"

const char* ssid = "UiTiOt-E3.1";
const char* password = "UiTiOtAP";


const char* serverName = "http://172.20.73.130/api/data";

unsigned long lastTime = 0;

unsigned long timerDelay = 5000;

//sensor
//--DHT
const int DHTPIN = 2;
const int DHTTYPE = DHT22;
DHT dht(DHTPIN, DHTTYPE);
struct dhtData{
  float temperature;
  float humidity;
};
//DUST
int voPin = 4;
int ledPin = 5;
float dustDensity = 0;
SharpGP2Y10 dustSensor(voPin, ledPin);
//MQ135
#define PIN_MQ135 4
MQ135 mq135_sensor = MQ135(PIN_MQ135);
//
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

  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
      WiFiClient client;
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");

      // Data to send with HTTP POST
      DynamicJsonDocument doc(1024);
      String httpRequestData;
      dhtData tem_hum = dhtRead();
      doc["temperature"] = tem_hum.temperature;
      doc["humidity"] = tem_hum.humidity;
      doc["ppm"] = mq135Read(tem_hum.temperature,tem_hum.humidity);
      doc["dust"] = dustSensor.getDustDensity();
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

dhtData dhtRead(){
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  dhtData result;
  result.temperature = t;
  result.humidity = h;
  return result;
  // DynamicJsonDocument doc(1024);
  // String result;
  // doc["temperature"] = t;
  // doc["humidity"] = h;
  // serializeJson(doc, result);
  // return result;
}

float mq135Read(float temperature, float humidity){
  float ppm = mq135_sensor.getPPM();
  return ppm;
  // float correctedPPM = mq135_sensor.getCorrectedPPM(temperature, humidity);
  // return correctedPPM;
}

