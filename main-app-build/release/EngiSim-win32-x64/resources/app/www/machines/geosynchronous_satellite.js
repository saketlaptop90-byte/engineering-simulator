export function createGeosynchronousSatellite(THREE) {
    const group = new THREE.Group();

    // 1. RotatingEarth
    const earthGeo = new THREE.SphereGeometry(3, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x1e90ff, wireframe: true, transparent: true, opacity: 0.8 });
    const RotatingEarth = new THREE.Mesh(earthGeo, earthMat);
    
    // 2. OrbitEquatorPlane
    const orbitPlaneGeo = new THREE.RingGeometry(3, 10, 64);
    const orbitPlaneMat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const OrbitEquatorPlane = new THREE.Mesh(orbitPlaneGeo, orbitPlaneMat);
    OrbitEquatorPlane.rotation.x = Math.PI / 2;

    // 3. GeostationaryOrbitPath
    const orbitPathGeo = new THREE.RingGeometry(9.95, 10.05, 64);
    const orbitPathMat = new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide });
    const GeostationaryOrbitPath = new THREE.Mesh(orbitPathGeo, orbitPathMat);
    GeostationaryOrbitPath.rotation.x = Math.PI / 2;

    // 4. SubSatellitePoint
    const subPointGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const subPointMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const SubSatellitePoint = new THREE.Mesh(subPointGeo, subPointMat);
    SubSatellitePoint.position.set(3, 0, 0);

    // 5. GroundStation
    const gsGeo = new THREE.ConeGeometry(0.2, 0.6, 8);
    gsGeo.translate(0, 0.3, 0);
    const gsMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const GroundStation = new THREE.Mesh(gsGeo, gsMat);
    const lat = 30 * Math.PI / 180;
    GroundStation.position.set(3 * Math.cos(lat), 3 * Math.sin(lat), 0);
    GroundStation.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), GroundStation.position.clone().normalize());

    // 6. SatelliteBus
    const busGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const busMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const SatelliteBus = new THREE.Mesh(busGeo, busMat);

    // 7. SolarPanelLeft
    const panelGeo = new THREE.BoxGeometry(2, 0.05, 0.6);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x002288 });
    const SolarPanelLeft = new THREE.Mesh(panelGeo, panelMat);
    SolarPanelLeft.position.set(-1.4, 0, 0);

    // 8. SolarPanelRight
    const SolarPanelRight = new THREE.Mesh(panelGeo, panelMat);
    SolarPanelRight.position.set(1.4, 0, 0);

    // 9. CommunicationAntenna
    const antennaGeo = new THREE.ConeGeometry(0.4, 0.6, 16);
    antennaGeo.translate(0, 0.3, 0);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const CommunicationAntenna = new THREE.Mesh(antennaGeo, antennaMat);
    CommunicationAntenna.position.set(0, 0, 0.4);
    CommunicationAntenna.rotation.x = Math.PI / 2; // Point cone along +Z axis

    // 10. LineOfSightBeam
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    beamGeo.translate(0, 0.5, 0);
    beamGeo.rotateX(Math.PI / 2); // points along +Z
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
    const LineOfSightBeam = new THREE.Mesh(beamGeo, beamMat);

    // Build Hierarchy
    const earthGroup = new THREE.Group();
    earthGroup.add(RotatingEarth);
    earthGroup.add(SubSatellitePoint);
    earthGroup.add(GroundStation);

    const satelliteGroup = new THREE.Group();
    satelliteGroup.add(SatelliteBus);
    satelliteGroup.add(SolarPanelLeft);
    satelliteGroup.add(SolarPanelRight);
    satelliteGroup.add(CommunicationAntenna);
    satelliteGroup.add(LineOfSightBeam);

    group.add(earthGroup);
    group.add(OrbitEquatorPlane);
    group.add(GeostationaryOrbitPath);
    group.add(satelliteGroup);

    const parts = [
        RotatingEarth,
        GeostationaryOrbitPath,
        SatelliteBus,
        SolarPanelLeft,
        SolarPanelRight,
        CommunicationAntenna,
        GroundStation,
        LineOfSightBeam,
        SubSatellitePoint,
        OrbitEquatorPlane
    ];

    const gsWorldPos = new THREE.Vector3();

    const update = (delta, time) => {
        const omega = 0.5; // radians per second
        const angle = time * omega;

        // Rotate Earth
        earthGroup.rotation.y = angle;

        // Orbit Satellite
        satelliteGroup.position.set(10 * Math.cos(angle), 0, -10 * Math.sin(angle));

        // Get Ground Station world position
        GroundStation.getWorldPosition(gsWorldPos);

        // Make Satellite point its +Z towards Ground Station
        satelliteGroup.lookAt(gsWorldPos);

        // Update beam scale
        const dist = satelliteGroup.position.distanceTo(gsWorldPos);
        LineOfSightBeam.scale.set(1, 1, dist);
    };

    const quizzes = [
        {
            question: "What is the orbital period of a geosynchronous satellite?",
            options: ["12 hours", "90 minutes", "24 hours (1 sidereal day)", "1 month"],
            correctAnswer: 2
        },
        {
            question: "At what approximate altitude above Earth's surface does a geostationary satellite orbit?",
            options: ["400 km", "35,786 km", "2,000 km", "384,400 km"],
            correctAnswer: 1
        },
        {
            question: "What is the primary difference between a geosynchronous and a geostationary orbit?",
            options: ["A geosynchronous orbit is always geostationary.", "A geostationary orbit lies exactly over the equator, making it a specific type of geosynchronous orbit.", "Geostationary satellites orbit faster than geosynchronous ones.", "There is no difference."],
            correctAnswer: 1
        },
        {
            question: "Why are geostationary orbits ideal for communication satellites?",
            options: ["They are perfectly shielded from solar radiation.", "They orbit the poles and provide global coverage instantly.", "They are closer to Earth, minimizing signal delay.", "The satellite appears stationary in the sky from the ground, allowing fixed antennas."],
            correctAnswer: 3
        },
        {
            question: "What is the 'sub-satellite point' in a geostationary orbit?",
            options: ["The shadow cast by the satellite on Earth.", "The location of the primary ground station.", "The point on Earth's equator directly beneath the satellite.", "The lowest point of the orbit."],
            correctAnswer: 2
        },
        {
            question: "If a satellite is in a geosynchronous orbit but NOT a geostationary orbit, what shape does its ground track typically trace?",
            options: ["A single stationary dot.", "A straight line along the equator.", "A circle around the poles.", "A figure-eight or an analemma."],
            correctAnswer: 3
        }
    ];

    return {
        group,
        parts,
        update,
        quizzes
    };
}
