export function createGravityAssistManeuver(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(-15, 0, 0);
    group.add(sun);
    parts.push({ name: "Sun", object: sun });

    // 2. PlanetOrbitPath
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints = [];
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(-15 + 20 * Math.cos(theta), 0, 20 * Math.sin(theta)));
    }
    orbitGeometry.setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x888888 });
    const planetOrbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
    group.add(planetOrbitPath);
    parts.push({ name: "PlanetOrbitPath", object: planetOrbitPath });

    // 3. TargetPlanet
    const planetGroup = new THREE.Group();
    planetGroup.position.set(5, 0, 0); // At x = -15 + 20 = 5

    const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x3366ff });
    const targetPlanet = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(targetPlanet);
    group.add(planetGroup);
    parts.push({ name: "TargetPlanet", object: targetPlanet });

    // 4. GravitationalSphereOfInfluence
    const soiGeometry = new THREE.SphereGeometry(4, 32, 32);
    const soiMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const soi = new THREE.Mesh(soiGeometry, soiMaterial);
    planetGroup.add(soi);
    parts.push({ name: "GravitationalSphereOfInfluence", object: soi });

    // 5. Spacecraft
    const scGeometry = new THREE.ConeGeometry(0.2, 0.6, 8);
    const scMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const spacecraft = new THREE.Mesh(scGeometry, scMaterial);
    group.add(spacecraft);
    parts.push({ name: "Spacecraft", object: spacecraft });

    // 6. HyperbolicPath
    const hyperGeometry = new THREE.BufferGeometry();
    const hyperPoints = [];
    for (let i = -20; i <= 20; i++) {
        const t = i / 10; // -2 to 2
        const x = 5 + 3 * Math.sinh(t);
        const y = 0;
        const z = 4 * Math.cosh(t) - 4.5;
        hyperPoints.push(new THREE.Vector3(x, y, z));
    }
    hyperGeometry.setFromPoints(hyperPoints);
    const hyperMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const hyperbolicPath = new THREE.Line(hyperGeometry, hyperMaterial);
    group.add(hyperbolicPath);
    parts.push({ name: "HyperbolicPath", object: hyperbolicPath });

    // 7. ApproachTrajectory
    const approachPoints = [
        new THREE.Vector3(5 + 3 * Math.sinh(-2.5), 0, 4 * Math.cosh(-2.5) - 4.5), 
        new THREE.Vector3(5 + 3 * Math.sinh(-2), 0, 4 * Math.cosh(-2) - 4.5)
    ];
    const approachGeo = new THREE.BufferGeometry().setFromPoints(approachPoints);
    const approachMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const approachTrajectory = new THREE.Line(approachGeo, approachMat);
    group.add(approachTrajectory);
    parts.push({ name: "ApproachTrajectory", object: approachTrajectory });

    // 8. DepartureTrajectory
    const depPoints = [
        new THREE.Vector3(5 + 3 * Math.sinh(2), 0, 4 * Math.cosh(2) - 4.5), 
        new THREE.Vector3(5 + 3 * Math.sinh(2.5), 0, 4 * Math.cosh(2.5) - 4.5)
    ];
    const depGeo = new THREE.BufferGeometry().setFromPoints(depPoints);
    const depMat = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const departureTrajectory = new THREE.Line(depGeo, depMat);
    group.add(departureTrajectory);
    parts.push({ name: "DepartureTrajectory", object: departureTrajectory });

    // 9. VelocityVectorApproach
    const vAppDir = new THREE.Vector3().subVectors(approachPoints[1], approachPoints[0]).normalize();
    const velocityVectorApproach = new THREE.ArrowHelper(vAppDir, approachPoints[0], 2, 0x00ff00);
    group.add(velocityVectorApproach);
    parts.push({ name: "VelocityVectorApproach", object: velocityVectorApproach });

    // 10. VelocityVectorDeparture
    const vDepDir = new THREE.Vector3().subVectors(depPoints[1], depPoints[0]).normalize();
    const velocityVectorDeparture = new THREE.ArrowHelper(vDepDir, depPoints[1], 4, 0x0000ff);
    group.add(velocityVectorDeparture);
    parts.push({ name: "VelocityVectorDeparture", object: velocityVectorDeparture });

    // Additional lights for the scene
    const ambientLight = new THREE.AmbientLight(0x404040);
    group.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(-15, 0, 0); // Sun acts as point light
    group.add(pointLight);

    let tParam = -2.5;

    const update = (delta, time) => {
        // Spacecraft moves along the hyperbolic path relative to the planet
        tParam += delta * 0.8;
        if (tParam > 2.5) {
            tParam = -2.5; // Reset animation
        }

        const x = 5 + 3 * Math.sinh(tParam);
        const y = 0;
        const z = 4 * Math.cosh(tParam) - 4.5;
        
        spacecraft.position.set(x, y, z);
        
        // Approximate velocity vector for rotation
        const dx = 3 * Math.cosh(tParam);
        const dz = 4 * Math.sinh(tParam);
        const velocity = new THREE.Vector3(dx, 0, dz).normalize();
        
        const targetPoint = new THREE.Vector3(x + velocity.x, y, z + velocity.z);
        spacecraft.lookAt(targetPoint);
        spacecraft.rotateX(Math.PI / 2);
    };

    const quizzes = [
        {
            question: "What is the primary purpose of a gravity assist maneuver?",
            options: [
                "To collect atmospheric samples",
                "To change a spacecraft's velocity without expending propellant",
                "To communicate with deep space networks",
                "To put a spacecraft into orbit around the target planet"
            ],
            answer: "To change a spacecraft's velocity without expending propellant"
        },
        {
            question: "From where does the spacecraft gain its energy during a gravity assist?",
            options: [
                "Solar radiation pressure",
                "The target planet's orbital momentum",
                "Magnetic field lines",
                "The spacecraft's thrusters"
            ],
            answer: "The target planet's orbital momentum"
        },
        {
            question: "What happens to the target planet's orbit after a spacecraft performs a gravity assist to speed up?",
            options: [
                "It speeds up significantly",
                "It slows down by an imperceptible amount",
                "It changes direction",
                "Its mass decreases"
            ],
            answer: "It slows down by an imperceptible amount"
        },
        {
            question: "Which of the following trajectories describes a gravity assist path relative to the planet?",
            options: [
                "Circular",
                "Elliptical",
                "Parabolic",
                "Hyperbolic"
            ],
            answer: "Hyperbolic"
        },
        {
            question: "Can a gravity assist be used to slow down a spacecraft?",
            options: [
                "Yes, by passing in front of the planet along its orbit",
                "No, gravity only accelerates objects",
                "Yes, by firing retro-rockets at the closest approach",
                "No, it only changes the direction, not the speed"
            ],
            answer: "Yes, by passing in front of the planet along its orbit"
        },
        {
            question: "What is the Oberth effect often used in conjunction with a gravity assist?",
            options: [
                "Using solar panels at closest approach",
                "Firing rocket engines at the highest speed (closest to the planet) for maximum efficiency",
                "Deploying a parachute in the upper atmosphere",
                "Using a magnetic sail to capture plasma"
            ],
            answer: "Firing rocket engines at the highest speed (closest to the planet) for maximum efficiency"
        }
    ];

    return {
        group,
        parts,
        update,
        quizzes
    };
}
