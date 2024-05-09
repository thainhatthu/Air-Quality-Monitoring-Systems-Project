#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>

const char *ssid = "anhthune";
const char *password = "07042003";
const char* mqtt_server = "192.168.137.1";
const char* topic = "v1/devices/me/telemetry";
const char* control_topic = "v1/devices/me/rpc/request/+";
const char* user_mqtt="group7";
const char* pwd_mqtt="123456";

WiFiClient espClient;
PubSubClient client(espClient);

BH1750 lightMeter;

void callback(char* topic, byte* payload, unsigned int length) {
  // Tạo một buffer để lưu chuỗi payload
  char buffer[length + 1];
  for (unsigned int i = 0; i < length; i++) {
    buffer[i] = (char)payload[i];
  }

  // Tạo một đối tượng JSON để phân tích chuỗi payload
  DynamicJsonDocument doc(200);
  deserializeJson(doc, buffer);

  String temp = doc[0];
  Serial.println(temp);
}


void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // Attempt to connect
    if (client.connect("lab4_2", user_mqtt, pwd_mqtt)) {
      Serial.println("connected");

      // Subscribe để nhận thông tin điều khiển từ dashboard
      client.subscribe(control_topic);
      Serial.print("Subscribed to: ");
      Serial.println(control_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.print(" wifi=");
      Serial.print(WiFi.status());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(D7, OUTPUT);
  pinMode(D8, OUTPUT);
  Serial.begin(9600);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  Wire.begin();
  lightMeter.begin();
}

void loop() {
  // confirm still connected to mqtt server
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float lux = lightMeter.readLightLevel(); //Đọc cường độ ánh sáng

  // Tạo một đối tượng JSON
  StaticJsonDocument<200> doc;
  
  // Thêm các trường dữ liệu vào đối tượng JSON
  doc["light"] = lux;
  
  // Chuyển đổi đối tượng JSON thành chuỗi JSON
  String jsonString;
  serializeJson(doc, jsonString);
  client.publish(topic, jsonString.c_str(), true);
}
