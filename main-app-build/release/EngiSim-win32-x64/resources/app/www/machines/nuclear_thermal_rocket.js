export function createNuclearThermalRocket(THREE) {
    const group = new THREE.Group();

    // 1. Reactor Core
    const coreGeo = new THREE.CylinderGeometry(2, 2, 6, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.4 });
    const reactorCore = new THREE.Mesh(coreGeo, coreMat);
    reactorCore.name = "reactorCore";
    group.add(reactorCore);

    // 2. Fuel Elements
    const fuelGroup = new THREE.Group();
    fuelGroup.name = "fuelElements";
    const fuelGeo = new THREE.CylinderGeometry(0.1, 0.1, 5.8, 8);
    const fuelMat = new THREE.MeshStandardMaterial({ color: 0x88cc88, emissive: 0x224422 });
    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.2;
        const fuel = new THREE.Mesh(fuelGeo, fuelMat);
        fuel.position.set(Math.cos(angle)*r, 0, Math.sin(angle)*r);
        fuelGroup.add(fuel);
    }
    group.add(fuelGroup);

    // 3. Control Drums
    const drumsGroup = new THREE.Group();
    drumsGroup.name = "controlDrums";
    const drumGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    // Half of the drum absorbs neutrons, half reflects. We'll use a single color for visual simplicity, 
    // or two materials if we wanted extreme detail. For now, a dark color represents the neutron poison.
    const drumMat = new THREE.MeshStandardMaterial({ color: 0x992222, metalness: 0.3, roughness: 0.7 }); 
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2.4;
        const drumContainer = new THREE.Group();
        const drum = new THREE.Mesh(drumGeo, drumMat);
        // Position container and drum
        drumContainer.position.set(Math.cos(angle)*r, 0, Math.sin(angle)*r);
        drum.position.set(0.1, 0, 0); // Offset slightly to show rotation
        drumContainer.add(drum);
        drumsGroup.add(drumContainer);
    }
    group.add(drumsGroup);

    // 4. Propellant Pump
    const pumpGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x334466, metalness: 0.8 });
    const propellantPump = new THREE.Mesh(pumpGeo, pumpMat);
    propellantPump.position.set(0, 5, 0);
    propellantPump.name = "propellantPump";
    group.add(propellantPump);

    // 5. Turbopump Turbine
    const turbineGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16);
    const turbineMat = new THREE.MeshStandardMaterial({ color: 0x664433, metalness: 0.7 });
    const turbopumpTurbine = new THREE.Mesh(turbineGeo, turbineMat);
    turbopumpTurbine.position.set(1.5, 5, 0);
    turbopumpTurbine.rotation.z = Math.PI / 2;
    turbopumpTurbine.name = "turbopumpTurbine";
    group.add(turbopumpTurbine);

    // 6. Radiation Shield
    const shieldGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.8, 32);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.3 });
    const radiationShield = new THREE.Mesh(shieldGeo, shieldMat);
    radiationShield.position.set(0, 3.5, 0);
    radiationShield.name = "radiationShield";
    group.add(radiationShield);

    // 7. Pressure Vessel
    const vesselGeo = new THREE.CylinderGeometry(2.8, 2.8, 6.5, 32);
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, transparent: true, opacity: 0.25 });
    const pressureVessel = new THREE.Mesh(vesselGeo, vesselMat);
    pressureVessel.name = "pressureVessel";
    group.add(pressureVessel);

    // 8. Converging Nozzle
    const convergingGeo = new THREE.CylinderGeometry(0.8, 2.5, 1.5, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
    const convergingNozzle = new THREE.Mesh(convergingGeo, nozzleMat);
    convergingNozzle.position.set(0, -3.75, 0);
    convergingNozzle.name = "convergingNozzle";
    group.add(convergingNozzle);

    // 9. Diverging Nozzle
    const divergingGeo = new THREE.CylinderGeometry(3.5, 0.8, 4, 32, 1, true); // Open ended cone
    const divergingMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide });
    const divergingNozzle = new THREE.Mesh(divergingGeo, divergingMat);
    divergingNozzle.position.set(0, -6.5, 0);
    divergingNozzle.name = "divergingNozzle";
    group.add(divergingNozzle);

    // 10. Hydrogen Propellant Flow (Exhaust)
    const exhaustGeo = new THREE.ConeGeometry(3.2, 8, 32, 1, true);
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0xaaaaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const hydrogenFlow = new THREE.Mesh(exhaustGeo, exhaustMat);
    hydrogenFlow.position.set(0, -10.5, 0);
    hydrogenFlow.rotation.x = Math.PI; // Point down
    hydrogenFlow.name = "hydrogenPropellantFlow";
    group.add(hydrogenFlow);

    // Tick function for animation
    group.tick = (time) => {
        // Rotate control drums slowly back and forth to simulate reactivity adjustment
        drumsGroup.children.forEach((drumContainer) => {
            drumContainer.rotation.y = Math.sin(time * 0.5) * 1.5;
        });

        // Spin the turbopump turbine rapidly
        turbopumpTurbine.rotation.x = time * 10;

        // Animate hydrogen exhaust (pulsing scale and opacity)
        const exhaustScale = 1 + Math.sin(time * 25) * 0.05;
        hydrogenFlow.scale.set(exhaustScale, 1 + Math.sin(time * 30) * 0.1, exhaustScale);
        hydrogenFlow.material.opacity = 0.4 + Math.sin(time * 15) * 0.2;
        
        // Pulse the fuel elements' emissive glow to simulate nuclear heating
        const glow = 0.4 + Math.sin(time * 3) * 0.3;
        fuelMat.emissiveIntensity = glow;
    };

    // 6 Quiz questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the control drums in a nuclear thermal rocket?",
            options: ["To pump hydrogen into the system", "To absorb neutrons and control the reactor's power level", "To store the liquid propellant", "To cool the nozzle"],
            answer: 1
        },
        {
            question: "Which element is most commonly proposed as the propellant in a nuclear thermal rocket?",
            options: ["Oxygen", "Methane", "Hydrogen", "Water"],
            answer: 2
        },
        {
            question: "What is the purpose of the turbopump in this system?",
            options: ["To cool the reactor core", "To generate electricity for the spacecraft", "To pressurize and feed the propellant into the reactor", "To control the direction of engine thrust"],
            answer: 2
        },
        {
            question: "Why is a radiation shield typically located above the reactor?",
            options: ["To increase engine thrust", "To protect the spacecraft payload and crew from reactor radiation", "To prevent the hydrogen from freezing in the tanks", "To act as a structural support for the nozzle"],
            answer: 1
        },
        {
            question: "What happens to the propellant in the diverging nozzle?",
            options: ["It is heated by the nuclear core", "The flow becomes choked at the throat", "The heated propellant expands and accelerates to supersonic speeds", "The nuclear chain reaction takes place"],
            answer: 2
        },
        {
            question: "Compared to traditional chemical rockets, what is the main advantage of a nuclear thermal rocket?",
            options: ["Lower overall cost", "Higher thrust-to-weight ratio", "Significantly higher specific impulse (efficiency)", "Easier to test and launch from Earth's surface"],
            answer: 2
        }
    ];

    return group;
}
