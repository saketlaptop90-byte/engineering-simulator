export function createMarineScrubber(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // 1. Scrubber Tower
    const towerGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.3 });
    const scrubberTower = new THREE.Mesh(towerGeo, towerMat);
    scrubberTower.position.set(0, 5, 0);
    model.add(scrubberTower);
    parts.push({
        name: "Scrubber Tower",
        description: "The main cylindrical body where exhaust gas mixes with washwater to remove sulfur oxides.",
        mesh: scrubberTower
    });

    // 2. Exhaust Gas Inlet
    const inletGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
    const inletMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const exhaustGasInlet = new THREE.Mesh(inletGeo, inletMat);
    exhaustGasInlet.rotation.z = Math.PI / 2;
    exhaustGasInlet.position.set(-3, 1.5, 0);
    model.add(exhaustGasInlet);
    parts.push({
        name: "Exhaust Gas Inlet",
        description: "Directs untreated exhaust gases from the engine into the bottom of the scrubber tower.",
        mesh: exhaustGasInlet
    });

    // 3. Packed Bed Section
    const bedGeo = new THREE.CylinderGeometry(1.9, 1.9, 3, 32);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x664422, wireframe: true });
    const packedBedSection = new THREE.Mesh(bedGeo, bedMat);
    packedBedSection.position.set(0, 4.5, 0);
    model.add(packedBedSection);
    parts.push({
        name: "Packed Bed Section",
        description: "Contains packing material to increase the surface area for gas-liquid contact.",
        mesh: packedBedSection
    });

    // 4. Washwater Spray Nozzles
    const nozzlesGroup = new THREE.Group();
    for(let i=0; i<4; i++){
        const nozzleGeo = new THREE.ConeGeometry(0.2, 0.4, 8);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x3333ff });
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        nozzle.rotation.x = Math.PI;
        nozzle.position.set(Math.cos(i*Math.PI/2)*1, 0, Math.sin(i*Math.PI/2)*1);
        nozzlesGroup.add(nozzle);
    }
    nozzlesGroup.position.set(0, 7.5, 0);
    model.add(nozzlesGroup);
    // Add an invisible mesh for the raycaster/interaction
    const nozzleHitboxGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    const nozzleHitboxMat = new THREE.MeshBasicMaterial({ visible: false });
    const washwaterSprayNozzles = new THREE.Mesh(nozzleHitboxGeo, nozzleHitboxMat);
    washwaterSprayNozzles.position.set(0, 7.5, 0);
    model.add(washwaterSprayNozzles);
    parts.push({
        name: "Washwater Spray Nozzles",
        description: "Sprays atomized washwater into the gas stream to react with and absorb sulfur dioxide.",
        mesh: washwaterSprayNozzles
    });

    // 5. Mist Eliminator
    const mistGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 32);
    const mistMat = new THREE.MeshStandardMaterial({ color: 0x999999, wireframe: true });
    const mistEliminator = new THREE.Mesh(mistGeo, mistMat);
    mistEliminator.position.set(0, 8.5, 0);
    model.add(mistEliminator);
    parts.push({
        name: "Mist Eliminator",
        description: "Captures and removes liquid droplets carried over by the gas stream before it exits.",
        mesh: mistEliminator
    });

    // 6. Clean Gas Outlet
    const outletGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    const outletMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const cleanGasOutlet = new THREE.Mesh(outletGeo, outletMat);
    cleanGasOutlet.position.set(0, 11, 0);
    model.add(cleanGasOutlet);
    parts.push({
        name: "Clean Gas Outlet",
        description: "Releases the treated, cleaned exhaust gas into the atmosphere.",
        mesh: cleanGasOutlet
    });

    // 7. Washwater Pump
    const pumpGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const washwaterPump = new THREE.Mesh(pumpGeo, pumpMat);
    washwaterPump.position.set(4, 0.75, 2);
    model.add(washwaterPump);
    parts.push({
        name: "Washwater Pump",
        description: "Pumps seawater or freshwater into the spray nozzles at high pressure.",
        mesh: washwaterPump
    });

    // 8. Washwater Treatment Unit
    const treatmentGeo = new THREE.BoxGeometry(3, 2, 2);
    const treatmentMat = new THREE.MeshStandardMaterial({ color: 0x446688 });
    const washwaterTreatmentUnit = new THREE.Mesh(treatmentGeo, treatmentMat);
    washwaterTreatmentUnit.position.set(5, 1, -2);
    model.add(washwaterTreatmentUnit);
    parts.push({
        name: "Washwater Treatment Unit",
        description: "Cleans the used washwater by removing particulate matter and heavy metals before discharge or recirculation.",
        mesh: washwaterTreatmentUnit
    });

    // 9. Sludge Tank
    const sludgeGeo = new THREE.CylinderGeometry(1, 1, 1.5, 16);
    const sludgeMat = new THREE.MeshStandardMaterial({ color: 0x332211 });
    const sludgeTank = new THREE.Mesh(sludgeGeo, sludgeMat);
    sludgeTank.position.set(8, 0.75, -2);
    model.add(sludgeTank);
    parts.push({
        name: "Sludge Tank",
        description: "Stores the solid waste and sludge separated from the washwater in the treatment unit for safe disposal ashore.",
        mesh: sludgeTank
    });

    // 10. Monitoring Sensors
    const sensorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0xdd2222 });
    const monitoringSensors = new THREE.Mesh(sensorGeo, sensorMat);
    monitoringSensors.position.set(0.8, 10.5, 0);
    model.add(monitoringSensors);
    parts.push({
        name: "Monitoring Sensors",
        description: "Continuously measures emission levels (SOx, CO2) and washwater quality (pH, turbidity) to ensure regulatory compliance.",
        mesh: monitoringSensors
    });

    // Kinematics: Particles for gas and water
    const waterParticles = new THREE.Group();
    const gasParticles = new THREE.Group();
    model.add(waterParticles);
    model.add(gasParticles);

    const waterGeo = new THREE.SphereGeometry(0.05, 4, 4);
    const waterParticleMat = new THREE.MeshBasicMaterial({ color: 0x66ccff });
    
    const gasGeo = new THREE.SphereGeometry(0.08, 4, 4);
    const dirtyGasMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const cleanGasMat = new THREE.MeshBasicMaterial({ color: 0xeeeeee });

    const numWater = 50;
    const waterData = [];
    for(let i=0; i<numWater; i++){
        const p = new THREE.Mesh(waterGeo, waterParticleMat);
        p.position.set((Math.random()-0.5)*3, 7.5, (Math.random()-0.5)*3);
        waterParticles.add(p);
        waterData.push({ mesh: p, speed: 2 + Math.random()*2 });
    }

    const numGas = 60;
    const gasData = [];
    for(let i=0; i<numGas; i++){
        const p = new THREE.Mesh(gasGeo, dirtyGasMat);
        p.position.set(-3 + Math.random(), 1.5 + (Math.random()-0.5)*0.5, (Math.random()-0.5)*1);
        gasParticles.add(p);
        gasData.push({
            mesh: p,
            state: 'inlet', // inlet, tower, outlet
            progress: Math.random()
        });
    }

    const update = (deltaTime) => {
        // Water drops fall from nozzles (y=7.5) down to bottom (y=0)
        waterData.forEach(wd => {
            wd.mesh.position.y -= wd.speed * deltaTime;
            if(wd.mesh.position.y < 0) {
                wd.mesh.position.y = 7.5;
                wd.mesh.position.x = (Math.random()-0.5)*3.5;
                wd.mesh.position.z = (Math.random()-0.5)*3.5;
            }
        });

        // Gas particles move from inlet, up tower, to outlet
        gasData.forEach(gd => {
            if (gd.state === 'inlet') {
                gd.mesh.position.x += 2 * deltaTime;
                if (gd.mesh.position.x > 0) {
                    gd.state = 'tower';
                    gd.mesh.position.x = (Math.random()-0.5)*3.5;
                }
            } else if (gd.state === 'tower') {
                gd.mesh.position.y += 3 * deltaTime;
                // Spin around randomly
                gd.mesh.position.x += (Math.random()-0.5)*0.5;
                gd.mesh.position.z += (Math.random()-0.5)*0.5;
                // constrain to cylinder
                const r = Math.sqrt(gd.mesh.position.x**2 + gd.mesh.position.z**2);
                if (r > 1.8) {
                    gd.mesh.position.x *= 1.8/r;
                    gd.mesh.position.z *= 1.8/r;
                }
                
                // Change color as it goes up
                if (gd.mesh.position.y > 6) {
                    gd.mesh.material = cleanGasMat;
                } else {
                    gd.mesh.material = dirtyGasMat;
                }

                if (gd.mesh.position.y > 10) {
                    gd.state = 'outlet';
                    gd.mesh.position.x = (Math.random()-0.5)*1;
                    gd.mesh.position.z = (Math.random()-0.5)*1;
                }
            } else if (gd.state === 'outlet') {
                gd.mesh.position.y += 4 * deltaTime;
                if (gd.mesh.position.y > 13) {
                    gd.state = 'inlet';
                    gd.mesh.position.set(-4, 1.5 + (Math.random()-0.5)*0.5, (Math.random()-0.5)*1);
                    gd.mesh.material = dirtyGasMat;
                }
            }
        });
    };

    const quizzes = [
        {
            question: "What is the primary pollutant removed by a marine exhaust gas cleaning system (scrubber)?",
            options: ["Carbon Dioxide (CO2)", "Nitrogen Oxides (NOx)", "Sulfur Oxides (SOx)", "Ozone (O3)"],
            answer: 2
        },
        {
            question: "In an open-loop scrubber system, what is used as the scrubbing medium?",
            options: ["Freshwater with added alkali", "Seawater", "Ammonia", "Activated Carbon"],
            answer: 1
        },
        {
            question: "What is the purpose of the mist eliminator in a scrubber tower?",
            options: ["To remove water droplets from the exiting clean gas", "To atomize the washwater", "To cool the exhaust gas", "To filter out solid particulates"],
            answer: 0
        },
        {
            question: "Why must the washwater be treated before discharge in a closed-loop system?",
            options: ["To recover valuable chemicals", "To remove unburned fuel", "To remove trapped particulate matter and heavy metals", "To increase its salinity"],
            answer: 2
        },
        {
            question: "What happens to the solid waste separated from the washwater?",
            options: ["It is incinerated on board", "It is pumped into the ocean", "It is stored in a sludge tank for disposal ashore", "It is mixed back into the fuel"],
            answer: 2
        },
        {
            question: "Which IMO regulation significantly drove the adoption of marine scrubbers?",
            options: ["MARPOL Annex VI (Global Sulfur Cap)", "SOLAS Chapter V", "Ballast Water Management Convention", "Polar Code"],
            answer: 0
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
