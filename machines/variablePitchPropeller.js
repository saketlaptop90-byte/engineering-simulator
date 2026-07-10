export function createVariablePitchPropeller(THREE) {
    const group = new THREE.Group();

    // 1. Engine Output Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);
    const shaftMat = new THREE.MeshStandardMaterial({color: 0x888888});
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-2, 0, 0);
    group.add(shaft);

    // 2. Hub Casing
    const hubGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
    const hubMat = new THREE.MeshStandardMaterial({color: 0x555555});
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(0, 0, 0);
    group.add(hub);

    // 3. Spinner Dome
    const spinnerGeo = new THREE.ConeGeometry(1, 2, 32);
    const spinnerMat = new THREE.MeshStandardMaterial({color: 0x222222});
    const spinner = new THREE.Mesh(spinnerGeo, spinnerMat);
    spinner.rotation.z = -Math.PI / 2;
    spinner.position.set(1.5, 0, 0);
    group.add(spinner);

    // 4. Pitch Change Cylinder
    const pitchCylinderGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 32);
    const pitchCylinderMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
    const pitchCylinder = new THREE.Mesh(pitchCylinderGeo, pitchCylinderMat);
    pitchCylinder.rotation.z = Math.PI / 2;
    pitchCylinder.position.set(0.8, 0, 0);
    group.add(pitchCylinder);

    // Propeller assembly group for rotating blades
    const propAssembly = new THREE.Group();
    group.add(propAssembly);

    const blades = [];

    for (let i = 0; i < 3; i++) {
        const bladeAssembly = new THREE.Group();
        
        // Distribution angle
        bladeAssembly.rotation.x = i * ((Math.PI * 2) / 3);
        
        const bladeGroup = new THREE.Group();
        bladeAssembly.add(bladeGroup);

        // 5. Blade Root
        const rootGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
        const rootMat = new THREE.MeshStandardMaterial({color: 0x777777});
        const root = new THREE.Mesh(rootGeo, rootMat);
        root.position.set(0, 0.75, 0);
        bladeGroup.add(root);

        // 6. Propeller Blade
        const bladeGeo = new THREE.BoxGeometry(0.8, 4, 0.1);
        const bladeMat = new THREE.MeshStandardMaterial({color: 0xdcdcdc});
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0, 3, 0);
        bladeGroup.add(blade);

        // 7. Counterweights
        const counterweightGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const counterweightMat = new THREE.MeshStandardMaterial({color: 0x111111});
        const counterweight = new THREE.Mesh(counterweightGeo, counterweightMat);
        counterweight.position.set(0.4, 1, 0);
        bladeGroup.add(counterweight);

        propAssembly.add(bladeAssembly);
        blades.push(bladeGroup);
    }

    // 8. Slip Ring
    const slipRingGeo = new THREE.TorusGeometry(0.6, 0.1, 16, 32);
    const slipRingMat = new THREE.MeshStandardMaterial({color: 0xb5a642}); // brass
    const slipRing = new THREE.Mesh(slipRingGeo, slipRingMat);
    slipRing.rotation.y = Math.PI / 2;
    slipRing.position.set(-0.5, 0, 0);
    group.add(slipRing);

    // 9. Governor Flyweights
    const flyweightsGeo = new THREE.BoxGeometry(0.4, 0.8, 0.4);
    const flyweightsMat = new THREE.MeshStandardMaterial({color: 0x333333});
    const flyweights = new THREE.Mesh(flyweightsGeo, flyweightsMat);
    flyweights.position.set(-1.5, 0.8, 0);
    group.add(flyweights);

    // 10. Governor Oil Pump
    const oilPumpGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const oilPumpMat = new THREE.MeshStandardMaterial({color: 0x444444});
    const oilPump = new THREE.Mesh(oilPumpGeo, oilPumpMat);
    oilPump.position.set(-1.5, -0.8, 0);
    group.add(oilPump);

    let time = 0;

    group.userData.animate = function(delta) {
        time += delta;
        // Propeller spinning (entire group, including hub, shaft, spinner)
        group.rotation.x += delta * 10; // engine spin

        // Blades changing pitch
        const pitchAngle = Math.sin(time * 0.5) * 0.5; // pitch ranges from -0.5 to 0.5 radians
        blades.forEach(blade => {
            // Rotating blade around its local Y axis changes pitch.
            blade.rotation.y = pitchAngle;
        });
    };

    group.userData.questions = [
        {
            question: "What is the primary purpose of a variable-pitch propeller?",
            options: [
                "To increase engine horsepower",
                "To maintain optimal angle of attack at different flight speeds",
                "To reduce the weight of the aircraft",
                "To cool the engine during flight"
            ],
            correctAnswer: 1
        },
        {
            question: "What mechanism is typically used to change the pitch of the propeller blades?",
            options: [
                "Electric motors in the wing",
                "Cable and pulley system",
                "Hydraulic pressure via an oil pump and pitch change cylinder",
                "Pneumatic air pressure from the cabin"
            ],
            correctAnswer: 2
        },
        {
            question: "What is the role of governor flyweights in a constant-speed propeller system?",
            options: [
                "To add weight to the propeller for balance",
                "To sense engine RPM and regulate oil flow to the pitch change mechanism",
                "To prevent the propeller from icing",
                "To provide an electrical ground for the alternator"
            ],
            correctAnswer: 1
        },
        {
            question: "What happens to the propeller pitch when the aircraft transitions to a higher cruise speed?",
            options: [
                "The pitch decreases (fine pitch)",
                "The pitch increases (coarse pitch)",
                "The pitch reverses",
                "The pitch remains completely unchanged"
            ],
            correctAnswer: 1
        },
        {
            question: "What is the function of the counterweights on the propeller blades?",
            options: [
                "To increase total aircraft weight",
                "To move the blades towards coarse pitch (or feather) using centrifugal force",
                "To generate extra thrust",
                "To act as a backup engine"
            ],
            correctAnswer: 1
        },
        {
            question: "What condition is known as 'feathering' a propeller?",
            options: [
                "Turning the blades to a fine pitch for takeoff",
                "Painting the blades like bird feathers",
                "Turning the blades parallel to the airflow to minimize drag during engine failure",
                "Operating the propeller at maximum RPM"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
