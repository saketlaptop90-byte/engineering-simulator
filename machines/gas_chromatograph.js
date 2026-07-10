export function createGasChromatograph(THREE) {
    const group = new THREE.Group();

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const darkMetalMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.4 });
    const redMaterial = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.5, roughness: 0.5 });
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x2222aa, metalness: 0.3, roughness: 0.7 });
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xcc8833, metalness: 0.1, roughness: 0.6 });

    // 1. Carrier Gas Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const gasCylinder = new THREE.Mesh(cylinderGeo, redMaterial);
    gasCylinder.position.set(-5, 1.5, -2);
    group.add(gasCylinder);

    // 2. Flow Controller
    const flowControllerGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const flowController = new THREE.Mesh(flowControllerGeo, darkMetalMaterial);
    flowController.position.set(-3.5, 2.5, -2);
    group.add(flowController);

    // 3. Injection Port
    const injectionPortGeo = new THREE.CylinderGeometry(0.2, 0.3, 1, 16);
    const injectionPort = new THREE.Mesh(injectionPortGeo, metalMaterial);
    injectionPort.position.set(-2, 3.5, 0);
    group.add(injectionPort);

    // 4. Septum
    const septumGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const septum = new THREE.Mesh(septumGeo, new THREE.MeshStandardMaterial({color: 0xdddddd}));
    septum.position.set(-2, 4.05, 0);
    group.add(septum);

    // 5. Oven
    const ovenGeo = new THREE.BoxGeometry(4, 4, 3);
    const oven = new THREE.Mesh(ovenGeo, darkMetalMaterial);
    oven.position.set(0, 1.5, 0);
    // Give oven some transparency so we can see the column inside
    oven.material.transparent = true;
    oven.material.opacity = 0.3;
    group.add(oven);

    // 6. Capillary Column (spiral inside oven)
    const curve = new THREE.CatmullRomCurve3(
        Array.from({length: 100}, (_, i) => {
            const t = i / 100;
            const angle = t * Math.PI * 20; // 10 turns
            const radius = 1.2 - t * 0.5; // tapering spiral
            return new THREE.Vector3(Math.cos(angle) * radius, (t - 0.5) * 3, Math.sin(angle) * radius);
        })
    );
    const columnGeo = new THREE.TubeGeometry(curve, 200, 0.05, 8, false);
    const column = new THREE.Mesh(columnGeo, columnMaterial);
    column.position.set(0, 1.5, 0);
    group.add(column);

    // 7. Detector
    const detectorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const detector = new THREE.Mesh(detectorGeo, metalMaterial);
    detector.position.set(2, 3.5, 0);
    group.add(detector);

    // 8. Flame Ionization Tip
    const tipGeo = new THREE.ConeGeometry(0.1, 0.3, 16);
    const tip = new THREE.Mesh(tipGeo, blueMaterial);
    tip.position.set(2, 4.25, 0);
    group.add(tip);

    // 9. Exhaust
    const exhaustGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const exhaust = new THREE.Mesh(exhaustGeo, darkMetalMaterial);
    exhaust.position.set(2, 5, 0);
    group.add(exhaust);

    // 10. Recorder/Display
    const displayGeo = new THREE.BoxGeometry(2, 1.5, 0.2);
    const display = new THREE.Mesh(displayGeo, screenMaterial);
    display.position.set(4, 2.5, 1.5);
    display.rotation.y = -Math.PI / 4;
    group.add(display);

    // Animation elements (samples separating)
    const sampleA = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xff0000}));
    const sampleB = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    const sampleC = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0x0000ff}));
    
    group.add(sampleA);
    group.add(sampleB);
    group.add(sampleC);

    group.userData.update = function(t) {
        // Animation loop: sample moves through the capillary column
        // t is time in seconds
        const durationA = 10;
        const durationB = 12;
        const durationC = 15;

        // Modulo time for looping
        const tA = (t % durationA) / durationA;
        const tB = (t % durationB) / durationB;
        const tC = (t % durationC) / durationC;

        if (tA < 1.0) {
            const posA = curve.getPoint(tA);
            sampleA.position.copy(posA).add(column.position);
            sampleA.visible = true;
        } else {
            sampleA.visible = false;
        }

        if (tB < 1.0) {
            const posB = curve.getPoint(tB);
            sampleB.position.copy(posB).add(column.position);
            sampleB.visible = true;
        } else {
            sampleB.visible = false;
        }

        if (tC < 1.0) {
            const posC = curve.getPoint(tC);
            sampleC.position.copy(posC).add(column.position);
            sampleC.visible = true;
        } else {
            sampleC.visible = false;
        }
        
        // Flicker the flame ionization tip size slightly to simulate burning
        tip.scale.set(1 + Math.sin(t * 50) * 0.1, 1 + Math.cos(t * 40) * 0.2, 1 + Math.sin(t * 50) * 0.1);
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the carrier gas in gas chromatography?",
            options: ["To dissolve the sample", "To transport the vaporized sample through the column", "To act as a stationary phase", "To cool the oven"],
            answer: 1
        },
        {
            question: "Why is the injection port typically heated to a high temperature?",
            options: ["To vaporize the sample quickly and completely", "To prevent the carrier gas from expanding", "To clean the column", "To increase the pressure"],
            answer: 0
        },
        {
            question: "What does the oven do in a gas chromatograph?",
            options: ["Controls the temperature of the column to optimize separation", "Burns the sample", "Stores the carrier gas", "Records the results"],
            answer: 0
        },
        {
            question: "How does the capillary column separate different compounds?",
            options: ["Based on their magnetic properties", "By filtering particles by size", "Through differing partition coefficients between the stationary phase and mobile phase", "By centrifuging the gas mixture"],
            answer: 2
        },
        {
            question: "What is the purpose of the Flame Ionization Detector (FID)?",
            options: ["To ignite the carrier gas", "To detect compounds by measuring the current produced by ions from a burnt sample", "To heat the injection port", "To display the chromatogram"],
            answer: 1
        },
        {
            question: "What role does the septum play in the injection port?",
            options: ["It filters impurities", "It seals the injection port to maintain pressure while allowing a needle to pierce it", "It separates the compounds", "It records the peaks"],
            answer: 1
        }
    ];

    return group;
}
