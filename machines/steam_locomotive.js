import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createSteamLocomotive(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Boiler
    const boilerGroup = new THREE.Group();
    const boilerGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    boilerGeo.rotateZ(Math.PI / 2);
    const boiler = new THREE.Mesh(boilerGeo, darkSteel);
    boiler.position.set(0, 3, 0);
    boilerGroup.add(boiler);

    const bandGeo = new THREE.CylinderGeometry(1.52, 1.52, 0.2, 32);
    bandGeo.rotateZ(Math.PI / 2);
    for(let i = -3; i <= 3; i += 2) {
        const band = new THREE.Mesh(bandGeo, brass);
        band.position.set(i, 3, 0);
        boilerGroup.add(band);
    }
    
    // Handrails
    const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 8).rotateZ(Math.PI/2);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(0, 3, 1.6);
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(0, 3, -1.6);
    boilerGroup.add(rail1, rail2);

    parts.push({
        name: 'Boiler',
        description: 'Massive central cylindrical vessel where water is heated to produce high-pressure steam.',
        material: 'Dark Steel, Brass',
        function: 'Stores thermal energy and water, maintaining high pressure to drive the cylinders.',
        assemblyOrder: 1,
        connections: ['Firebox', 'Smokebox & Chimney'],
        failureEffect: 'Loss of pressure, catastrophic explosion if safety valves fail.',
        cascadeFailures: ['Steam Cylinders', 'Whistle & Safety Valves'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        group: boilerGroup
    });

    // 2. Firebox
    const fireboxGroup = new THREE.Group();
    const fbOuter = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3.2), castIron);
    fbOuter.position.set(-5.5, 2.5, 0);
    fireboxGroup.add(fbOuter);
    
    const fbInner = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1, 3.3), fire);
    fbInner.position.set(-5.5, 1.5, 0);
    fireboxGroup.add(fbInner);

    parts.push({
        name: 'Firebox',
        description: 'Rear combustion chamber where fuel (coal or oil) is burned.',
        material: 'Cast Iron, Fire',
        function: 'Generates intense heat which travels through the boiler tubes to heat the water.',
        assemblyOrder: 2,
        connections: ['Boiler', 'Cab'],
        failureEffect: 'Loss of heat, engine stops producing steam.',
        cascadeFailures: ['Boiler'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -4, z: 0 },
        group: fireboxGroup
    });

    // 3. Smokebox & Chimney
    const smokeGroup = new THREE.Group();
    const smokeBox = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 2.5, 32).rotateZ(Math.PI/2), darkSteel);
    smokeBox.position.set(5.25, 3, 0);
    smokeGroup.add(smokeBox);

    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 2, 16), darkSteel);
    chimney.position.set(5.5, 4.5, 0);
    smokeGroup.add(chimney);
    
    const chimneyTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.5, 16), brass);
    chimneyTop.position.set(5.5, 5.5, 0);
    smokeGroup.add(chimneyTop);

    parts.push({
        name: 'Smokebox & Chimney',
        description: 'Front section collecting exhaust steam and smoke before venting it upwards.',
        material: 'Dark Steel, Brass',
        function: 'Creates a draft by using exhaust steam to pull hot gases through the boiler tubes.',
        assemblyOrder: 3,
        connections: ['Boiler', 'Steam Cylinders'],
        failureEffect: 'Loss of draft, fire dies down, lack of steam generation.',
        cascadeFailures: ['Boiler'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 4, z: 0 },
        group: smokeGroup
    });

    // 4. Driving Wheels
    const wheelsGroup = new THREE.Group();
    const wheelXs = [-2, 1, 4];
    const wheelPivots = [];
    
    const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32).rotateX(Math.PI/2);
    const spokeGeo = new THREE.BoxGeometry(0.1, 2.4, 0.1);
    const counterWeightGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.22, 16, 1, false, 0, Math.PI/2).rotateX(Math.PI/2);
    
    wheelXs.forEach(x => {
        const pivotL = new THREE.Group();
        pivotL.position.set(x, 1.2, 1.6);
        const wL = new THREE.Mesh(wheelGeo, redAccent);
        pivotL.add(wL);
        for(let i=0; i<8; i++) {
            const spoke = new THREE.Mesh(spokeGeo, redAccent);
            spoke.rotation.z = i * Math.PI/8;
            pivotL.add(spoke);
        }
        const cwL = new THREE.Mesh(counterWeightGeo, castIron);
        cwL.rotation.z = Math.PI/4;
        pivotL.add(cwL);
        const pinL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4).rotateX(Math.PI/2), steel);
        pinL.position.set(0.6, 0, 0.15); 
        pivotL.add(pinL);
        
        const pivotR = new THREE.Group();
        pivotR.position.set(x, 1.2, -1.6);
        const wR = new THREE.Mesh(wheelGeo, redAccent);
        pivotR.add(wR);
        for(let i=0; i<8; i++) {
            const spoke = new THREE.Mesh(spokeGeo, redAccent);
            spoke.rotation.z = i * Math.PI/8;
            pivotR.add(spoke);
        }
        const cwR = new THREE.Mesh(counterWeightGeo, castIron);
        cwR.rotation.z = Math.PI/4;
        pivotR.add(cwR);
        const pinR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4).rotateX(Math.PI/2), steel);
        pinR.position.set(0, 0.6, -0.15); 
        pivotR.add(pinR);
        
        wheelsGroup.add(pivotL, pivotR);
        wheelPivots.push({L: pivotL, R: pivotR});
    });
    wheelsGroup.userData.pivots = wheelPivots;

    parts.push({
        name: 'Driving Wheels',
        description: 'Large steel wheels with counterweights to balance the heavy connecting rods.',
        material: 'Red Painted Steel, Cast Iron',
        function: 'Converts the reciprocating motion of the pistons into rotational motion to propel the locomotive.',
        assemblyOrder: 4,
        connections: ['Connecting Rods'],
        failureEffect: 'Loss of traction, derailment, or violent shaking.',
        cascadeFailures: ['Connecting Rods'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        group: wheelsGroup
    });

    // 5. Connecting Rods
    const rodsGroup = new THREE.Group();
    
    const sideRodL = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 0.1), steel);
    const sideRodR = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 0.1), steel);
    
    const mainRodL = new THREE.Group(); 
    const mainRodMeshL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 0.1), steel);
    mainRodMeshL.position.set(1.75, 0, 0);
    mainRodL.add(mainRodMeshL);
    
    const mainRodR = new THREE.Group();
    const mainRodMeshR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 0.1), steel);
    mainRodMeshR.position.set(1.75, 0, 0);
    mainRodR.add(mainRodMeshR);
    
    const pistonL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2).rotateZ(Math.PI/2), steel);
    const pistonR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2).rotateZ(Math.PI/2), steel);
    
    rodsGroup.add(sideRodL, sideRodR, mainRodL, mainRodR, pistonL, pistonR);
    rodsGroup.userData = { sideRodL, sideRodR, mainRodL, mainRodR, pistonL, pistonR };

    parts.push({
        name: 'Connecting Rods',
        description: 'Heavy steel linkages connecting the steam cylinders to the driving wheels.',
        material: 'Steel',
        function: 'Transmits power from pistons to the wheels, and synchronizes all driving wheels.',
        assemblyOrder: 5,
        connections: ['Driving Wheels', 'Steam Cylinders'],
        failureEffect: 'Catastrophic mechanical destruction, rods tearing into the ground or boiler.',
        cascadeFailures: ['Driving Wheels', 'Steam Cylinders'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 5 },
        group: rodsGroup
    });

    // 6. Steam Cylinders
    const cylindersGroup = new THREE.Group();
    const cylL = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 32).rotateZ(Math.PI/2), darkSteel);
    cylL.position.set(7, 1.2, 1.8);
    const cylR = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 32).rotateZ(Math.PI/2), darkSteel);
    cylR.position.set(7, 1.2, -1.8);
    
    const valveL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16).rotateZ(Math.PI/2), darkSteel);
    valveL.position.set(7, 2.0, 1.6);
    const valveR = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16).rotateZ(Math.PI/2), darkSteel);
    valveR.position.set(7, 2.0, -1.6);
    
    cylindersGroup.add(cylL, cylR, valveL, valveR);

    parts.push({
        name: 'Steam Cylinders',
        description: 'High-pressure chambers where steam expands against a moving piston.',
        material: 'Cast Iron, Dark Steel',
        function: 'Provides the mechanical work to move the train by pushing pistons back and forth.',
        assemblyOrder: 6,
        connections: ['Connecting Rods', 'Smokebox & Chimney'],
        failureEffect: 'Loss of motive power, massive steam leak.',
        cascadeFailures: ['Connecting Rods'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8, y: -2, z: 3 },
        group: cylindersGroup
    });

    // 7. Cab
    const cabGroup = new THREE.Group();
    const cabWallGeo = new THREE.BoxGeometry(3.5, 3.5, 3.6);
    const cabBase = new THREE.Mesh(cabWallGeo, steel);
    cabBase.position.set(-6, 4.25, 0);
    cabGroup.add(cabBase);
    
    const roofGeo = new THREE.CylinderGeometry(2, 2, 4, 32, 1, false, 0, Math.PI).rotateZ(Math.PI/2);
    const roof = new THREE.Mesh(roofGeo, darkSteel);
    roof.position.set(-6, 5.8, 0);
    roof.scale.set(1, 0.4, 1); 
    cabGroup.add(roof);
    
    const winGeo = new THREE.BoxGeometry(1.5, 1.2, 3.7);
    const windows = new THREE.Mesh(winGeo, glass);
    windows.position.set(-6, 4.5, 0);
    cabGroup.add(windows);

    parts.push({
        name: 'Cab',
        description: 'Rear compartment protecting the engineer and fireman.',
        material: 'Steel, Glass',
        function: 'Houses the controls (throttle, reverser, brake valves) and gauges to operate the train.',
        assemblyOrder: 7,
        connections: ['Firebox', 'Boiler'],
        failureEffect: 'Exposure of crew to harsh elements, loss of vehicle control.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 8, z: 0 },
        group: cabGroup
    });

    // 8. Tender
    const tenderGroup = new THREE.Group();
    const tenderChassis = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 3.4), darkSteel);
    tenderChassis.position.set(-11.5, 1.5, 0);
    tenderGroup.add(tenderChassis);
    
    const tenderBody = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.5, 3.2), steel);
    tenderBody.position.set(-11.5, 3.0, 0);
    tenderGroup.add(tenderBody);
    
    const coalGeo = new THREE.DodecahedronGeometry(1.5, 1);
    coalGeo.scale(1.5, 0.5, 1);
    const coal = new THREE.Mesh(coalGeo, castIron);
    coal.position.set(-10.5, 4.5, 0);
    tenderGroup.add(coal);
    
    const twXs = [-9, -10.5, -12.5, -14];
    twXs.forEach(x => {
        const w1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16).rotateX(Math.PI/2), darkSteel);
        w1.position.set(x, 0.6, 1.5);
        const w2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 16).rotateX(Math.PI/2), darkSteel);
        w2.position.set(x, 0.6, -1.5);
        tenderGroup.add(w1, w2);
    });

    parts.push({
        name: 'Tender',
        description: 'Trailing car directly behind the locomotive carrying fuel and water.',
        material: 'Steel, Cast Iron',
        function: 'Supplies the massive amounts of water and coal needed to sustain steam production.',
        assemblyOrder: 8,
        connections: ['Cab'],
        failureEffect: 'Train runs out of fuel or water, bringing it to a halt.',
        cascadeFailures: ['Firebox'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -16, y: 0, z: 0 },
        group: tenderGroup
    });

    // 9. Pilot / Cowcatcher
    const pilotGroup = new THREE.Group();
    const wedgeGeo = new THREE.CylinderGeometry(0, 1.5, 2, 4).rotateZ(-Math.PI/2).rotateX(Math.PI/4);
    const pilot = new THREE.Mesh(wedgeGeo, darkSteel);
    pilot.position.set(8.5, 1.0, 0);
    pilotGroup.add(pilot);
    
    const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), brass);
    lightBox.position.set(6.2, 4.5, 0);
    pilotGroup.add(lightBox);
    const lightLens = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1).rotateZ(Math.PI/2), glass);
    lightLens.position.set(6.55, 4.5, 0);
    pilotGroup.add(lightLens);

    parts.push({
        name: 'Pilot / Cowcatcher',
        description: 'Angled metal wedge at the very front of the locomotive.',
        material: 'Dark Steel, Brass',
        function: 'Deflects obstacles off the tracks to prevent derailment.',
        assemblyOrder: 9,
        connections: ['Smokebox & Chimney'],
        failureEffect: 'Increased risk of derailment from debris.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 0, z: 0 },
        group: pilotGroup
    });

    // 10. Whistle & Safety Valves
    const valvesGroup = new THREE.Group();
    const dome1 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1, 16), darkSteel);
    dome1.position.set(1, 4.2, 0);
    const dome1Top = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), darkSteel);
    dome1Top.position.set(1, 4.7, 0);
    valvesGroup.add(dome1, dome1Top);
    
    const dome2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16), darkSteel);
    dome2.position.set(-1.5, 4.2, 0);
    const dome2Top = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), darkSteel);
    dome2Top.position.set(-1.5, 4.6, 0);
    valvesGroup.add(dome2, dome2Top);
    
    const whistle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), brass);
    whistle.position.set(-3, 4.5, 0);
    valvesGroup.add(whistle);

    parts.push({
        name: 'Whistle & Safety Valves',
        description: 'Brass fixtures mounted atop the boiler.',
        material: 'Brass, Dark Steel',
        function: 'Relieves excess pressure to prevent explosion, and sounds warnings.',
        assemblyOrder: 10,
        connections: ['Boiler'],
        failureEffect: 'If safety valves fail, the boiler can explode catastrophically.',
        cascadeFailures: ['Boiler'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 7, z: 0 },
        group: valvesGroup
    });

    parts.forEach(part => group.add(part.group));

    const quizQuestions = [
        {
            question: "Which thermodynamic cycle most accurately describes the operation of a steam locomotive?",
            options: ["Otto Cycle", "Brayton Cycle", "Rankine Cycle", "Diesel Cycle"],
            correctIndex: 2,
            explanation: "The Rankine cycle is the fundamental operating cycle of all steam engines, involving heating water, expanding steam, and exhausting it.",
            difficulty: "Medium"
        },
        {
            question: "What type of boiler is universally used in conventional steam locomotives?",
            options: ["Fire-tube boiler", "Water-tube boiler", "Flash boiler", "Monotube boiler"],
            correctIndex: 0,
            explanation: "Steam locomotives use fire-tube boilers where hot gases from the firebox pass through tubes surrounded by water to maximize surface area.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary purpose of the Stephenson valve gear on a locomotive?",
            options: ["To brake the train", "To control the timing and direction of steam entering the cylinders", "To pump water into the boiler", "To regulate the smokestack draft"],
            correctIndex: 1,
            explanation: "Valve gear controls when steam is admitted to the cylinders, allowing the engineer to reverse the locomotive and adjust cutoff for efficiency.",
            difficulty: "Hard"
        },
        {
            question: "What factor limits the maximum tractive effort (pulling force) a locomotive can apply before the wheels slip?",
            options: ["Boiler pressure", "Cylinder diameter", "Weight on the driving wheels", "Smokebox draft"],
            correctIndex: 2,
            explanation: "Tractive effort is physically limited by friction (adhesion) between the steel wheels and steel rails, proportional to the weight on the driven wheels.",
            difficulty: "Medium"
        },
        {
            question: "Why were steam locomotives ultimately replaced by diesel-electric locomotives?",
            options: ["Steam engines could not pull heavy loads", "Diesel fuel is non-flammable", "Diesels offer much higher thermal efficiency and lower maintenance", "Steam engines were too quiet and caused accidents"],
            correctIndex: 2,
            explanation: "Steam locomotives had a thermal efficiency of only ~6%, required constant maintenance, and high turnaround times compared to the ~30% efficient and ready-to-run diesels.",
            difficulty: "Easy"
        },
        {
            question: "What is the function of a superheater in a steam locomotive?",
            options: ["To heat the cab for the crew", "To raise the steam temperature above its boiling point", "To heat the coal before burning", "To cool down the exhaust steam"],
            correctIndex: 1,
            explanation: "Superheating increases efficiency and power by heating saturated steam into dry, superheated steam, preventing it from condensing back into water in the cylinders.",
            difficulty: "Hard"
        }
    ];

    return {
        group,
        parts,
        description: "A classic Steam Locomotive. Burning fuel boils water to create high-pressure steam, which is expanded in cylinders to drive massive steel wheels via connecting rods.",
        quizQuestions,
        animate(time, speed, meshes) {
            const t = time * speed * 4.0;
            
            const wheels = meshes.find(m => m.name === 'Driving Wheels')?.group;
            if (wheels && wheels.userData.pivots) {
                wheels.userData.pivots.forEach(p => {
                    p.L.rotation.z = -t;
                    p.R.rotation.z = -t;
                });
            }
            
            const rods = meshes.find(m => m.name === 'Connecting Rods')?.group;
            if (rods && rods.userData) {
                const r = 0.6;
                const cx = 1;
                const cy = 1.2;
                
                const pinLx = 4 + r * Math.cos(-t);
                const pinLy = cy + r * Math.sin(-t);
                
                const pinRx = 4 - r * Math.sin(-t);
                const pinRy = cy + r * Math.cos(-t);
                
                rods.userData.sideRodL.position.set(cx + r * Math.cos(-t), cy + r * Math.sin(-t), 1.75);
                rods.userData.sideRodR.position.set(cx - r * Math.sin(-t), cy + r * Math.cos(-t), -1.75);
                
                const L = 3.5;
                const dyL = 1.2 - pinLy;
                const dxL = Math.sqrt(L*L - dyL*dyL) || L;
                const pistonLx = pinLx + dxL;
                
                rods.userData.mainRodL.position.set(pinLx, pinLy, 1.85);
                rods.userData.mainRodL.rotation.z = Math.atan2(dyL, dxL);
                rods.userData.pistonL.position.set(pistonLx - 1, 1.2, 1.85);
                
                const dyR = 1.2 - pinRy;
                const dxR = Math.sqrt(L*L - dyR*dyR) || L;
                const pistonRx = pinRx + dxR;
                
                rods.userData.mainRodR.position.set(pinRx, pinRy, -1.85);
                rods.userData.mainRodR.rotation.z = Math.atan2(dyR, dxR);
                rods.userData.pistonR.position.set(pistonRx - 1, 1.2, -1.85);
            }
        }
    };
}
