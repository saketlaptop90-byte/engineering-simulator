export function createSeismicMonitoringNetwork(THREE) {
    const group = new THREE.Group();

    // 1. VolcanicEdifice (Mountain/Cone)
    const volcanoGeo = new THREE.ConeGeometry(50, 40, 32);
    const volcanoMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, wireframe: true });
    const volcanicEdifice = new THREE.Mesh(volcanoGeo, volcanoMat);
    volcanicEdifice.name = "VolcanicEdifice";
    group.add(volcanicEdifice);

    // 2. MagmaIntrusion (Underground reservoir)
    const magmaGeo = new THREE.SphereGeometry(10, 16, 16);
    const magmaMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const magmaIntrusion = new THREE.Mesh(magmaGeo, magmaMat);
    magmaIntrusion.position.set(0, -10, 0);
    magmaIntrusion.name = "MagmaIntrusion";
    group.add(magmaIntrusion);

    // 3. BroadbandSeismometer
    const seismoGeo = new THREE.BoxGeometry(2, 2, 2);
    const seismoMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const broadbandSeismometer = new THREE.Mesh(seismoGeo, seismoMat);
    broadbandSeismometer.position.set(15, -2, 10);
    broadbandSeismometer.name = "BroadbandSeismometer";
    group.add(broadbandSeismometer);

    // 4. BoreholeTiltmeter
    const tiltGeo = new THREE.CylinderGeometry(0.5, 0.5, 15);
    const tiltMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const boreholeTiltmeter = new THREE.Mesh(tiltGeo, tiltMat);
    boreholeTiltmeter.position.set(-20, -10, 5);
    boreholeTiltmeter.name = "BoreholeTiltmeter";
    group.add(boreholeTiltmeter);

    // 5. GPSReceiver
    const gpsGeo = new THREE.CylinderGeometry(1, 1, 3);
    const gpsMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const gpsReceiver = new THREE.Mesh(gpsGeo, gpsMat);
    gpsReceiver.position.set(10, 5, -15);
    gpsReceiver.name = "GPSReceiver";
    group.add(gpsReceiver);

    // 6. GasSpectrometer
    const gasGeo = new THREE.BoxGeometry(3, 2, 4);
    const gasMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const gasSpectrometer = new THREE.Mesh(gasGeo, gasMat);
    gasSpectrometer.position.set(5, 10, 5);
    gasSpectrometer.name = "GasSpectrometer";
    group.add(gasSpectrometer);

    // 7. InSARSatellite
    const satGroup = new THREE.Group();
    const satBodyGeo = new THREE.BoxGeometry(4, 4, 4);
    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const satBody = new THREE.Mesh(satBodyGeo, satBodyMat);
    satGroup.add(satBody);
    
    const panelGeo = new THREE.BoxGeometry(12, 0.2, 2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x000055 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    satGroup.add(panel);
    
    satGroup.position.set(0, 60, 0);
    satGroup.name = "InSARSatellite";
    group.add(satGroup);

    // 8. DataTelemetryHub
    const hubGeo = new THREE.SphereGeometry(3, 16, 16);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const dataTelemetryHub = new THREE.Mesh(hubGeo, hubMat);
    dataTelemetryHub.position.set(25, -18, 20);
    dataTelemetryHub.name = "DataTelemetryHub";
    group.add(dataTelemetryHub);

    // 9. SolarPanelArray
    const solarGeo = new THREE.PlaneGeometry(5, 5);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x002288, side: THREE.DoubleSide });
    const solarPanelArray = new THREE.Mesh(solarGeo, solarMat);
    solarPanelArray.rotation.x = Math.PI / 4;
    solarPanelArray.position.set(28, -19, 20);
    solarPanelArray.name = "SolarPanelArray";
    group.add(solarPanelArray);

    // 10. Strainmeter
    const strainGeo = new THREE.CylinderGeometry(0.3, 0.3, 20);
    const strainMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const strainmeter = new THREE.Mesh(strainGeo, strainMat);
    strainmeter.position.set(0, -25, 15);
    strainmeter.name = "Strainmeter";
    group.add(strainmeter);

    // Animation features
    let time = 0;
    group.userData.update = function(deltaTime) {
        time += deltaTime;

        // Satellite orbit
        satGroup.position.x = Math.cos(time * 0.5) * 60;
        satGroup.position.z = Math.sin(time * 0.5) * 60;
        satGroup.rotation.y = -time * 0.5;

        // Magma pulsing indicating intrusion
        const scale = 1 + Math.sin(time * 2) * 0.1;
        magmaIntrusion.scale.set(scale, scale, scale);

        // Solar panel tracking sun (simple oscillation)
        solarPanelArray.rotation.y = Math.sin(time * 0.1) * 0.5;
    };

    // Quiz
    group.userData.quiz = [
        {
            question: "What does a broadband seismometer primarily measure in a volcanic setting?",
            options: [
                "Ground vibrations across a wide range of frequencies",
                "Temperature changes in the soil",
                "Atmospheric pressure variations",
                "Changes in the Earth's magnetic field"
            ],
            correctAnswer: 0
        },
        {
            question: "How is a GPS receiver utilized in volcano monitoring?",
            options: [
                "To navigate around the volcano safely",
                "To measure precise surface deformation and ground movement",
                "To track wildlife movement away from the volcano",
                "To measure the speed of the wind at the crater"
            ],
            correctAnswer: 1
        },
        {
            question: "What does an increase in sulfur dioxide (SO2) emissions, detected by a gas spectrometer, often indicate?",
            options: [
                "Decreasing volcanic activity",
                "Magma rising closer to the surface",
                "An impending tectonic earthquake",
                "High amounts of upcoming rainfall"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the main purpose of a borehole tiltmeter?",
            options: [
                "To measure the tilt of surrounding trees and structures",
                "To extract water from deep underground springs",
                "To detect minute changes in the slope or tilt of the ground surface",
                "To measure the exact temperature of deep magma"
            ],
            correctAnswer: 2
        },
        {
            question: "How does an InSAR satellite aid in seismic and volcanic monitoring?",
            options: [
                "By providing high-resolution maps of surface deformation over broad areas from space",
                "By taking simple optical photographs of the volcano's crater",
                "By broadcasting evacuation alerts directly to residents",
                "By analyzing the chemical composition of solidified lava"
            ],
            correctAnswer: 0
        },
        {
            question: "What does a strainmeter measure in the context of volcanic and tectonic activity?",
            options: [
                "The amount of stress people feel during an earthquake",
                "Small changes in the crustal rocks' volume or shape due to stress",
                "The length and height of the volcanic ash plume",
                "The electrical conductivity of the surrounding ground"
            ],
            correctAnswer: 1
        }
    ];

    return group;
}
