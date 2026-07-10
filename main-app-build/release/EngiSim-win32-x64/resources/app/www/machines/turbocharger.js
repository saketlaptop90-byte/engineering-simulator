import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createTurbocharger(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Exhaust Turbine Housing
    const exhaustHousingGroup = new THREE.Group();
    const exTorus = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.6, 16, 64, Math.PI * 1.5), castIron);
    exTorus.rotation.y = Math.PI / 2;
    const exInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16), castIron);
    exInlet.position.set(0, 1.5, -0.75);
    exInlet.rotation.x = Math.PI / 2;
    exhaustHousingGroup.add(exTorus, exInlet);
    exhaustHousingGroup.position.set(-2, 0, 0);

    // 2. Turbine Wheel
    const turbineWheelGroup = new THREE.Group();
    const twHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.4, 0.8, 16), darkSteel);
    twHub.rotation.z = Math.PI / 2;
    turbineWheelGroup.add(twHub);
    for(let i=0; i<10; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.05), darkSteel);
        blade.position.y = 0.4;
        blade.rotation.y = Math.PI / 6;
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI * 2) / 10;
        pivot.add(blade);
        turbineWheelGroup.add(pivot);
    }
    turbineWheelGroup.position.set(-2, 0, 0);

    // 3. Center Housing Rotating Assembly (CHRA)
    const chraGroup = new THREE.Group();
    const chraBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32), aluminum);
    chraBody.rotation.z = Math.PI / 2;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.2, 16), chrome);
    shaft.rotation.z = Math.PI / 2;
    chraGroup.add(chraBody, shaft);

    // 4. Oil Feed / Drain Lines
    const oilLinesGroup = new THREE.Group();
    const oilFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 16), copper);
    oilFeed.position.set(0, 0.8, 0);
    const oilDrain = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), copper);
    oilDrain.position.set(0, -0.8, 0);
    oilLinesGroup.add(oilFeed, oilDrain);

    // 5. Compressor Housing
    const compressorHousingGroup = new THREE.Group();
    const compTorus = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.7, 16, 64, Math.PI * 1.5), aluminum);
    compTorus.rotation.y = Math.PI / 2;
    const compOutlet = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.5, 16), aluminum);
    compOutlet.position.set(0, 1.6, 0.75);
    compOutlet.rotation.x = Math.PI / 2;
    compressorHousingGroup.add(compTorus, compOutlet);
    compressorHousingGroup.position.set(2, 0, 0);

    // 6. Compressor Wheel
    const compressorWheelGroup = new THREE.Group();
    const cwHub = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 0.8, 16), titanium);
    cwHub.rotation.z = Math.PI / 2;
    compressorWheelGroup.add(cwHub);
    for(let i=0; i<12; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.05), titanium);
        blade.position.y = 0.45;
        blade.rotation.y = -Math.PI / 6;
        const pivot = new THREE.Group();
        pivot.rotation.x = (i * Math.PI * 2) / 12;
        pivot.add(blade);
        compressorWheelGroup.add(pivot);
    }
    compressorWheelGroup.position.set(2, 0, 0);

    // 7. Wastegate Valve
    const wastegateValveGroup = new THREE.Group();
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4), steel);
    hinge.rotation.x = Math.PI / 2;
    const flap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1), steel);
    flap.rotation.x = Math.PI / 2;
    flap.position.set(-0.3, -0.4, 0); 
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), steel);
    arm.position.set(-0.15, 0, 0); 
    wastegateValveGroup.add(hinge, flap, arm);
    wastegateValveGroup.position.set(-1.2, 1.5, -0.5);

    // 8. Wastegate Actuator
    const wastegateActuatorGroup = new THREE.Group();
    const canister = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16), brass);
    canister.rotation.z = Math.PI / 2;
    canister.position.set(0.5, 1.5, -0.5);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 16), steel);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(-0.5, 1.5, -0.5);
    wastegateActuatorGroup.add(canister, rod);

    // 9. Exhaust Gas Flow
    const exhaustFlowGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), fire);
        exhaustFlowGroup.add(p);
    }

    // 10. Compressed Air Flow
    const airFlowGroup = new THREE.Group();
    for(let i=0; i<40; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), blueAccent);
        airFlowGroup.add(p);
    }

    // Push parts
    parts.push({
        name: "Exhaust Turbine Housing",
        description: "The 'hot side' snail-shell casing. It collects high-pressure exhaust gases and directs them into the turbine wheel.",
        material: "Cast Iron",
        function: "Accelerates exhaust gas and directs it radially onto the turbine blades.",
        assemblyOrder: 4,
        connections: ["CHRA", "Exhaust Manifold", "Downpipe"],
        failureEffect: "Cracking from extreme heat cycling, leading to exhaust leaks and loss of turbo spool.",
        cascadeFailures: ["Turbine Wheel"],
        originalPosition: new THREE.Vector3(-2, 0, 0),
        explodedPosition: new THREE.Vector3(-6, 0, 0),
        group: exhaustHousingGroup
    });

    parts.push({
        name: "Turbine Wheel",
        description: "A bladed wheel made of high-temperature alloy that spins when struck by exhaust gases.",
        material: "Dark Steel / Inconel",
        function: "Converts the heat and pressure of exhaust gases into rotational kinetic energy to drive the compressor.",
        assemblyOrder: 2,
        connections: ["Shaft", "Exhaust Turbine Housing"],
        failureEffect: "Shattering from foreign object damage or extreme temperatures.",
        cascadeFailures: ["Compressor Wheel", "CHRA"],
        originalPosition: new THREE.Vector3(-2, 0, 0),
        explodedPosition: new THREE.Vector3(-4, 0, 0),
        group: turbineWheelGroup
    });

    parts.push({
        name: "Center Housing Rotating Assembly (CHRA)",
        description: "The central core connecting the hot and cold sides, containing the bearing system and shaft.",
        material: "Aluminum / Steel",
        function: "Supports the rotating shaft at high speeds and routes oil/coolant for lubrication and heat dissipation.",
        assemblyOrder: 1,
        connections: ["Turbine Housing", "Compressor Housing", "Oil Lines"],
        failureEffect: "Bearing failure leading to excessive shaft play, oil burning, and wheel-to-housing contact.",
        cascadeFailures: ["Turbine Wheel", "Compressor Wheel"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 3, 0),
        group: chraGroup
    });

    parts.push({
        name: "Oil Feed / Drain Lines",
        description: "Pipes that supply pressurized engine oil to the bearings and drain it back to the oil pan.",
        material: "Copper / Braided Steel",
        function: "Lubricates the journal bearings and carries away intense heat from the turbine side.",
        assemblyOrder: 6,
        connections: ["CHRA", "Engine Block"],
        failureEffect: "Oil starvation or coking, leading to rapid bearing destruction.",
        cascadeFailures: ["CHRA"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -4, 0),
        group: oilLinesGroup
    });

    parts.push({
        name: "Compressor Housing",
        description: "The 'cold side' snail-shell casing. It collects high-velocity air from the wheel and slows it down to increase pressure.",
        material: "Aluminum",
        function: "Converts high-velocity air into high-pressure air (boost) before sending it to the engine.",
        assemblyOrder: 5,
        connections: ["CHRA", "Intake Piping", "Intercooler"],
        failureEffect: "Boost leaks or damage from wheel contact.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(2, 0, 0),
        explodedPosition: new THREE.Vector3(6, 0, 0),
        group: compressorHousingGroup
    });

    parts.push({
        name: "Compressor Wheel",
        description: "A lightweight bladed wheel that draws in fresh air and accelerates it outwards.",
        material: "Titanium / Billet Aluminum",
        function: "Sucks in ambient air and flings it radially outwards at high speed into the compressor housing.",
        assemblyOrder: 3,
        connections: ["Shaft", "Compressor Housing"],
        failureEffect: "Blade damage from sucking in debris, causing severe imbalance and failure.",
        cascadeFailures: ["CHRA", "Engine Cylinders"],
        originalPosition: new THREE.Vector3(2, 0, 0),
        explodedPosition: new THREE.Vector3(4, 0, 0),
        group: compressorWheelGroup
    });

    parts.push({
        name: "Wastegate Valve",
        description: "A bypass flap located in the exhaust housing.",
        material: "Steel",
        function: "Opens to allow exhaust gases to bypass the turbine wheel, regulating maximum turbine speed and boost pressure.",
        assemblyOrder: 7,
        connections: ["Exhaust Turbine Housing", "Wastegate Actuator"],
        failureEffect: "Stuck open: No boost. Stuck closed: Over-boosting, leading to engine destruction.",
        cascadeFailures: ["Engine Block"],
        originalPosition: new THREE.Vector3(-1.2, 1.5, -0.5),
        explodedPosition: new THREE.Vector3(-3, 4, -2),
        group: wastegateValveGroup
    });

    parts.push({
        name: "Wastegate Actuator",
        description: "A pneumatic spring-loaded canister with a pushrod connected to the wastegate valve.",
        material: "Brass / Steel",
        function: "Uses intake manifold pressure to overcome a spring and push the rod, opening the wastegate at a specific boost level.",
        assemblyOrder: 8,
        connections: ["Compressor Housing", "Wastegate Valve"],
        failureEffect: "Ruptured diaphragm leads to failure to open the wastegate, causing engine over-boost.",
        cascadeFailures: ["Wastegate Valve", "Engine Block"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(2, 4, -2),
        group: wastegateActuatorGroup
    });

    parts.push({
        name: "Exhaust Gas Flow",
        description: "The stream of hot, expanding exhaust gases leaving the engine cylinders.",
        material: "Red Accent / Fire",
        function: "Provides the kinetic and thermal energy required to spool the turbocharger.",
        assemblyOrder: 9,
        connections: ["Turbine Wheel"],
        failureEffect: "Exhaust leaks reduce energy reaching the turbine, causing turbo lag.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 0),
        group: exhaustFlowGroup
    });

    parts.push({
        name: "Compressed Air Flow",
        description: "The stream of pressurized, dense air (boost) being forced into the engine.",
        material: "Blue Accent",
        function: "Packs more oxygen into the engine cylinders, allowing more fuel to be burned for more power.",
        assemblyOrder: 10,
        connections: ["Compressor Wheel", "Intercooler"],
        failureEffect: "Boost leaks in piping cause rich air/fuel ratios and power loss.",
        cascadeFailures: [],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 0),
        group: airFlowGroup
    });

    parts.forEach(part => group.add(part.group));

    const quizQuestions = [
        {
            question: "What is the primary purpose of forced induction (like a turbocharger)?",
            options: [
                "To cool down the engine oil",
                "To force more air into the cylinders for more power",
                "To reduce exhaust emissions",
                "To increase the engine's redline RPM"
            ],
            correct: 1,
            explanation: "Forced induction compresses the incoming air, packing more oxygen into the cylinders. This allows the engine to burn more fuel, creating a larger explosion and more power.",
            difficulty: "Easy"
        },
        {
            question: "What is 'turbo lag'?",
            options: [
                "The delay between pressing the throttle and feeling the boost kick in",
                "When the turbocharger overheats",
                "A delay in engine starting",
                "When the wastegate gets stuck open"
            ],
            correct: 0,
            explanation: "Turbo lag is the time it takes for exhaust gases to build up enough pressure and velocity to spool the turbine wheel up to speed and create boost.",
            difficulty: "Easy"
        },
        {
            question: "What is the function of the wastegate?",
            options: [
                "To dump oil when pressure is too high",
                "To cool the compressed air",
                "To bypass exhaust gas around the turbine to regulate boost pressure",
                "To filter out debris from the exhaust"
            ],
            correct: 2,
            explanation: "The wastegate opens to divert exhaust gas away from the turbine wheel. This stops the turbine from spinning any faster, safely limiting the maximum boost pressure.",
            difficulty: "Medium"
        },
        {
            question: "Why is an intercooler often necessary in a turbocharged system?",
            options: [
                "Compressing air heats it up; the intercooler cools it to increase density",
                "It cools the turbocharger's bearing housing",
                "It prevents the exhaust manifold from melting",
                "It acts as a secondary air filter"
            ],
            correct: 0,
            explanation: "The act of compressing air drastically increases its temperature. Hot air is less dense and prone to causing engine knock. An intercooler cools the charge air back down.",
            difficulty: "Medium"
        },
        {
            question: "What is the main difference between a supercharger and a turbocharger?",
            options: [
                "Superchargers make more total power",
                "Superchargers are driven by a belt from the engine, turbos are driven by exhaust gas",
                "Turbos use electricity, superchargers use exhaust",
                "Superchargers are only used on diesel engines"
            ],
            correct: 1,
            explanation: "A supercharger is mechanically driven by the engine's crankshaft via a belt, while a turbocharger is driven by the waste energy of the exiting exhaust gases.",
            difficulty: "Medium"
        },
        {
            question: "What does a Blow-Off Valve (BOV) do?",
            options: [
                "Releases exhaust pressure when the engine turns off",
                "Prevents compressor surge by releasing pressurized air when the throttle closes",
                "Injects extra fuel during high boost",
                "Bypasses the intercooler when it's cold"
            ],
            correct: 1,
            explanation: "When you lift off the throttle, the throttle plate closes. The turbo is still spinning and creating boost, which has nowhere to go. The BOV vents this pressure to prevent it from slamming back into the compressor wheel.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes || meshes.length < 10) return;
        
        const turbineGroup = meshes[1].group;
        const compressorGroup = meshes[5].group;
        const wastegateValve = meshes[6].group;
        const wastegateActuator = meshes[7].group;
        const exhaustFlow = meshes[8].group;
        const airFlow = meshes[9].group;

        // Spin wheels rapidly
        const rotationSpeed = speed * 15;
        turbineGroup.rotation.x -= rotationSpeed;
        compressorGroup.rotation.x -= rotationSpeed;

        // Wastegate occasionally opens
        const wgOpen = Math.max(0, Math.sin(time * speed * 1.5) * 0.6); 
        wastegateValve.rotation.z = wgOpen;
        wastegateActuator.children[1].position.x = -0.5 - wgOpen * 0.15;

        // Animate Exhaust Flow (spirals inward and exits axially)
        exhaustFlow.children.forEach((p, i) => {
            const t = (time * speed + i * 0.025) % 1.0;
            const angle = t * Math.PI * 6; // 3 revolutions
            const radius = 1.5 * (1 - t) + 0.2 * t;
            const xPos = -1.5 - t * 1.5; 
            p.position.set(xPos, Math.sin(angle) * radius, Math.cos(angle) * radius);
        });

        // Animate Compressed Air Flow (enters axially and spirals outward)
        airFlow.children.forEach((p, i) => {
            const t = (time * speed + i * 0.025) % 1.0;
            const angle = t * Math.PI * 6;
            const radius = 0.2 * (1 - t) + 1.6 * t;
            const xPos = 3 - t * 1.5; 
            p.position.set(xPos, Math.sin(angle) * radius, Math.cos(angle) * radius);
        });
    }

    return {
        group,
        parts,
        description: "A Turbocharger is an exhaust-driven forced induction device that increases an internal combustion engine's efficiency and power output by forcing extra compressed air into the combustion chamber.",
        quizQuestions,
        animate
    };
}
