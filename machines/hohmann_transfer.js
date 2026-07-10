export function createHohmannTransferOrbit(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. CentralBody (Sun)
    const centralGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const centralMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const centralBody = new THREE.Mesh(centralGeometry, centralMaterial);
    group.add(centralBody);
    parts.push(centralBody);

    const r1 = 4;
    const r2 = 9;

    // 2. InnerOrbitingBody (Earth)
    const innerBodyGeom = new THREE.SphereGeometry(0.4, 16, 16);
    const innerBodyMat = new THREE.MeshStandardMaterial({ color: 0x0088ff });
    const innerBody = new THREE.Mesh(innerBodyGeom, innerBodyMat);
    group.add(innerBody);
    parts.push(innerBody);

    // 3. OuterOrbitingBody (Mars)
    const outerBodyGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const outerBodyMat = new THREE.MeshStandardMaterial({ color: 0xff4400 });
    const outerBody = new THREE.Mesh(outerBodyGeom, outerBodyMat);
    group.add(outerBody);
    parts.push(outerBody);

    // 4. TransferSpacecraft
    const scGroup = new THREE.Group();
    const scGeom = new THREE.ConeGeometry(0.15, 0.4, 16);
    const scMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const spacecraft = new THREE.Mesh(scGeom, scMat);
    spacecraft.rotation.x = -Math.PI / 2; // Point along local -Z
    scGroup.add(spacecraft);
    group.add(scGroup);
    parts.push(scGroup);

    // 5. PeriapsisBurnPlume
    const plume1Geom = new THREE.ConeGeometry(0.08, 0.3, 8);
    const plume1Mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    const periapsisPlume = new THREE.Mesh(plume1Geom, plume1Mat);
    periapsisPlume.position.set(0, 0, 0.35); // base near spacecraft
    periapsisPlume.rotation.x = Math.PI / 2; // point backward (+Z)
    scGroup.add(periapsisPlume);
    parts.push(periapsisPlume);

    // 6. ApoapsisBurnPlume
    const plume2Geom = new THREE.ConeGeometry(0.08, 0.3, 8);
    const plume2Mat = new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0 });
    const apoapsisPlume = new THREE.Mesh(plume2Geom, plume2Mat);
    apoapsisPlume.position.set(0, 0, 0.35);
    apoapsisPlume.rotation.x = Math.PI / 2; // point backward (+Z)
    scGroup.add(apoapsisPlume);
    parts.push(apoapsisPlume);

    // 7. TransferOrbitPath
    const transferPathGroup = new THREE.Group();
    const transferCurve = new THREE.EllipseCurve(
        (r1 - r2)/2, 0,
        (r1 + r2)/2, Math.sqrt(r1 * r2),
        0, 2 * Math.PI,
        false, 0
    );
    const transferPts = transferCurve.getPoints(64);
    const points3D = transferPts.map(p => new THREE.Vector3(p.x, 0, -p.y));
    const transferGeom = new THREE.BufferGeometry().setFromPoints(points3D);
    const transferMat = new THREE.LineDashedMaterial({ color: 0xffaa00, dashSize: 0.2, gapSize: 0.1 });
    const transferPath = new THREE.Line(transferGeom, transferMat);
    transferPath.computeLineDistances();
    transferPathGroup.add(transferPath);
    group.add(transferPathGroup);
    parts.push(transferPathGroup);

    // 8. InnerOrbitPath
    const innerOrbitGeom = new THREE.RingGeometry(r1 - 0.02, r1 + 0.02, 64);
    const innerOrbitMat = new THREE.MeshBasicMaterial({ color: 0x0088ff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const innerOrbitPath = new THREE.Mesh(innerOrbitGeom, innerOrbitMat);
    innerOrbitPath.rotation.x = Math.PI / 2;
    group.add(innerOrbitPath);
    parts.push(innerOrbitPath);

    // 9. OuterOrbitPath
    const outerOrbitGeom = new THREE.RingGeometry(r2 - 0.02, r2 + 0.02, 64);
    const outerOrbitMat = new THREE.MeshBasicMaterial({ color: 0xff4400, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const outerOrbitPath = new THREE.Mesh(outerOrbitGeom, outerOrbitMat);
    outerOrbitPath.rotation.x = Math.PI / 2;
    group.add(outerOrbitPath);
    parts.push(outerOrbitPath);

    // 10. OrbitalNodeMarker
    const markerGeom = new THREE.OctahedronGeometry(0.2);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const nodeMarker = new THREE.Mesh(markerGeom, markerMat);
    group.add(nodeMarker);
    parts.push(nodeMarker);

    // Animation constants
    const w1 = 1.0;
    const w2 = Math.pow(r1/r2, 1.5) * w1; 

    const a_trans = (r1 + r2) / 2;
    const e_trans = (r2 - r1) / (r2 + r1);
    const w_trans = Math.pow(r1/a_trans, 1.5) * w1;
    const t_trans = Math.PI / w_trans; 

    const cycleTime = 2 * Math.PI / (w1 - w2); 

    const t_wait = 0.5;
    const t_burn1 = 0.5;
    const t_burn2 = 0.5;
    
    // Outer planet phase offset to ensure intercept
    const phase2 = (w1 - w2) * (t_wait + t_burn1) + Math.PI - w2 * t_trans;

    function solveKepler(M, e) {
        let E = M;
        for(let i=0; i<10; i++) {
            E = E - (E - e*Math.sin(E) - M) / (1 - e*Math.cos(E));
        }
        return E;
    }

    const update = (delta, time) => {
        const cycle = Math.floor(time / cycleTime);
        const localTime = time - cycle * cycleTime;
        const cycleStartTime = cycle * cycleTime;
        const launchTime = cycleStartTime + t_wait + t_burn1;
        const currentStartAngle = w1 * launchTime;
        
        transferPathGroup.rotation.y = currentStartAngle;

        const interceptAngle = currentStartAngle + Math.PI;
        nodeMarker.position.set(r2 * Math.cos(interceptAngle), 0, -r2 * Math.sin(interceptAngle));
        nodeMarker.rotation.y += delta * 2;
        nodeMarker.rotation.x += delta;

        // Continuous planet orbits
        const innerAngle = w1 * time;
        innerBody.position.set(r1 * Math.cos(innerAngle), 0, -r1 * Math.sin(innerAngle));

        const outerAngle = w2 * time + phase2;
        outerBody.position.set(r2 * Math.cos(outerAngle), 0, -r2 * Math.sin(outerAngle));

        let sc_x = 0, sc_z = 0;
        let target_rot_y = 0;

        periapsisPlume.material.opacity = 0;
        apoapsisPlume.material.opacity = 0;

        if (localTime < t_wait + t_burn1) {
            const angle = w1 * time; 
            sc_x = r1 * Math.cos(angle);
            sc_z = -r1 * Math.sin(angle);
            
            const next_angle = w1 * (time + 0.01);
            const nx = r1 * Math.cos(next_angle);
            const nz = -r1 * Math.sin(next_angle);
            target_rot_y = Math.atan2(nx - sc_x, -(nz - sc_z));

            if (localTime >= t_wait) {
                periapsisPlume.material.opacity = 0.7 + 0.3 * Math.random();
            }
        } else if (localTime < t_wait + t_burn1 + t_transfer) {
            const dt = localTime - (t_wait + t_burn1);
            const fraction = dt / t_transfer;
            
            let M = fraction * Math.PI; 
            if (M > Math.PI - 1e-6) M = Math.PI - 1e-6;
            
            const E = solveKepler(M, e_trans);
            const trueAnomaly = 2 * Math.atan(Math.sqrt((1 + e_trans)/(1 - e_trans)) * Math.tan(E / 2));
            const r = a_trans * (1 - e_trans * e_trans) / (1 + e_trans * Math.cos(trueAnomaly));
            const currentAngle = currentStartAngle + trueAnomaly;
            
            sc_x = r * Math.cos(currentAngle);
            sc_z = -r * Math.sin(currentAngle);
            
            const dt2 = dt + 0.01;
            const fraction2 = dt2 / t_transfer;
            if (fraction2 >= 1.0) {
                const next_angle = w2 * (time + 0.01) + phase2;
                const nx = r2 * Math.cos(next_angle);
                const nz = -r2 * Math.sin(next_angle);
                target_rot_y = Math.atan2(nx - sc_x, -(nz - sc_z));
            } else {
                let M2 = fraction2 * Math.PI;
                if (M2 > Math.PI - 1e-6) M2 = Math.PI - 1e-6;
                const E2 = solveKepler(M2, e_trans);
                const trueAnomaly2 = 2 * Math.atan(Math.sqrt((1 + e_trans)/(1 - e_trans)) * Math.tan(E2 / 2));
                const r2_trans = a_trans * (1 - e_trans * e_trans) / (1 + e_trans * Math.cos(trueAnomaly2));
                const currentAngle2 = currentStartAngle + trueAnomaly2;
                const nx = r2_trans * Math.cos(currentAngle2);
                const nz = -r2_trans * Math.sin(currentAngle2);
                target_rot_y = Math.atan2(nx - sc_x, -(nz - sc_z));
            }
        } else {
            const angle = w2 * time + phase2; 
            sc_x = r2 * Math.cos(angle);
            sc_z = -r2 * Math.sin(angle);
            
            const next_angle = w2 * (time + 0.01) + phase2;
            const nx = r2 * Math.cos(next_angle);
            const nz = -r2 * Math.sin(next_angle);
            target_rot_y = Math.atan2(nx - sc_x, -(nz - sc_z));
            
            if (localTime < t_wait + t_burn1 + t_transfer + t_burn2) {
                apoapsisPlume.material.opacity = 0.7 + 0.3 * Math.random();
            }
        }

        scGroup.position.set(sc_x, 0, sc_z);
        scGroup.rotation.y = target_rot_y;
    };

    const quizzes = [
        {
            question: "What is a Hohmann transfer orbit?",
            options: [
                "An elliptical orbit used to transfer between two circular orbits of different radii in the same plane",
                "A parabolic trajectory used for interstellar travel",
                "A direct straight-line path between two planets",
                "A maneuver that changes the inclination of an orbit"
            ],
            answer: 0
        },
        {
            question: "How many engine burns are typically required for a standard Hohmann transfer?",
            options: ["1", "2", "3", "4"],
            answer: 1
        },
        {
            question: "Where does the first burn (Delta-V) of a Hohmann transfer to a higher orbit occur?",
            options: [
                "At the apoapsis of the transfer orbit",
                "At the periapsis of the transfer orbit",
                "At the ascending node",
                "Halfway through the transfer"
            ],
            answer: 1
        },
        {
            question: "Why is the Hohmann transfer widely used in spaceflight?",
            options: [
                "It is the fastest possible transfer method",
                "It uses the least amount of propellant for coplanar circular orbits",
                "It requires no engine burns",
                "It avoids passing through the Van Allen radiation belts"
            ],
            answer: 1
        },
        {
            question: "In a Hohmann transfer from Earth to Mars, what is the apoapsis of the transfer orbit?",
            options: [
                "Earth's orbital radius",
                "Mars's orbital radius",
                "Halfway between Earth and Mars",
                "The Sun's surface"
            ],
            answer: 1
        },
        {
            question: "What is required for a spacecraft to successfully rendezvous with a target planet using a Hohmann transfer?",
            options: [
                "The target planet must be at a specific phase angle relative to the departure planet when the transfer begins",
                "The spacecraft must travel faster than the speed of light",
                "The two planets must be aligned perfectly in a straight line with the Sun at launch",
                "The transfer must be initiated at perihelion"
            ],
            answer: 0
        }
    ];

    return { group, parts, update, quizzes };
}
