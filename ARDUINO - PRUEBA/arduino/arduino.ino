#include <DHT.h>
#define DHTPIN 2 // Pin donde está conectado el DHT11
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

const int soilMoisturePin = A0; // Pin donde está conectado el sensor de humedad del suelo

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int soilMoistureValue = analogRead(soilMoisturePin);
  
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Enviar datos al puerto serie
  Serial.print("Temperature:");
  Serial.print(t);
  Serial.print(",Humidity:");
  Serial.print(h);
  Serial.print(",SoilMoisture:");
  Serial.println(soilMoistureValue);

  delay(250); // Esperar 2 segundos antes de la próxima lectura
}
