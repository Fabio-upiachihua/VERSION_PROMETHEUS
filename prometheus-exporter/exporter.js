const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;  // Cambia esto si necesitas usar otro puerto

app.get('/metrics', async (req, res) => {
    try {
        // Solicita los datos desde tu API
        const response = await axios.get('https://lobby-bff-test.apiusoft.com/actuator/metrics');
        const data = response.data;

        // Inicializa una lista de promesas para todas las métricas
        const metricsPromises = data.names.map(async (name) => {
            try {
                const metricResponse = await axios.get(`https://lobby-bff-test.apiusoft.com/actuator/metrics/${name}`);
                const metricData = metricResponse.data;

                // Extrae el valor de la métrica
                const value = metricData.measurements[0].value;

                // Transforma el nombre de la métrica para evitar caracteres no válidos
                const safeName = name.replace(/[^a-zA-Z0-9_]/g, '_');

                // Construye la cadena de métrica en formato Prometheus
                return `${safeName} ${value}\n`;
            } catch (metricError) {
                console.error(`Error fetching metric ${name}:`, metricError);
                return '';  // En caso de error, devuelve una cadena vacía
            }
        });

        // Espera a que todas las métricas sean procesadas
        const metricsArray = await Promise.all(metricsPromises);
        const metrics = metricsArray.join('');  // Une todas las métricas en una sola cadena

        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).send('Error fetching metrics');
    }
});

app.listen(port, () => {
    console.log(`Exporter running at http://localhost:${port}/metrics`);
});
