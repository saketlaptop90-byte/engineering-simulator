import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ============================================================================
    // CUSTOM SHADERS & ADVANCED MATERIALS
    // ============================================================================
    
    // Superfluid Bulk Material - highly refractive, slight eerie glow
    const superfluidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        metalness: 0.1,
        roughness: 0.0,
        transmission: 0.98,
        ior: 1.028, // Liquid helium has a very low index of refraction (approx 1.028)
        thickness: 2.0,
        transparent: true,
        opacity: 0.9,
        emissive: 0x113355,
        emissiveIntensity: 0.2
    });

    // Rollin Film Shader - Creeping film effect with vertex displacement and scrolling UVs
    const rollinFilmUniforms = {
        time: { value: 0.0 },
        flowSpeed: { value: 1.5 },
        baseColor: { value: new THREE.Color(0xaaddff) },
        thickness: { value: 0.02 }
    };
    const rollinFilmMaterial = new THREE.ShaderMaterial({
        uniforms: rollinFilmUniforms,
        vertexShader: `
            uniform float time;
            uniform float flowSpeed;
            uniform float thickness;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec3 pos = position;
                // Micro-ripples in the creeping film
                float ripple = sin(pos.y * 50.0 - time * flowSpeed * 10.0) * 0.005;
                pos += normal * (thickness + ripple);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 baseColor;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                // Iridescent sheen for the thin film
                float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                vec3 finalColor = mix(baseColor, vec3(1.0, 1.0, 1.0), intensity * 0.5);
                gl_FragColor = vec4(finalColor, 0.4 + intensity * 0.3);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // Glowing Neon for UI and Heater
    const neonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00aa88,
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.5
    });

    // ============================================================================
    // PROCEDURAL GEOMETRY GENERATORS
    // ============================================================================

    // 1. Off-Road Tire Generator (Per strict mandate: Torus + Extruded Box lugs + Cylinder Spokes)
    function createTireSystem() {
        const tireGroup = new THREE.Group();
        
        // Main Torus for tire body
        const torusGeo = new THREE.TorusGeometry(3.0, 1.2, 32, 100);
        const tireBody = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireBody);

        // Hundreds of tiny extruded BoxGeometry lugs
        const lugGeo = new THREE.BoxGeometry(0.6, 0.8, 1.5);
        const numLugs = 120;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            // Alternating staggered pattern
            const offset = (i % 2 === 0) ? 0.3 : -0.3; 
            
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(angle) * 3.8;
            lug.position.y = Math.sin(angle) * 3.8;
            lug.position.z = offset;
            
            // Align lug with normal
            lug.rotation.z = angle;
            // Slight tilt for aggressive tread
            lug.rotation.x = (i % 2 === 0) ? 0.2 : -0.2;
            
            tireGroup.add(lug);
        }

        // Rim using CylinderGeometry and complex spoke array
        const rimOuterGeo = new THREE.CylinderGeometry(2.0, 2.0, 2.5, 64);
        const rimOuter = new THREE.Mesh(rimOuterGeo, darkSteel);
        rimOuter.rotation.x = Math.PI / 2;
        tireGroup.add(rimOuter);

        const rimInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.7, 32);
        const rimInner = new THREE.Mesh(rimInnerGeo, chrome);
        rimInner.rotation.x = Math.PI / 2;
        tireGroup.add(rimInner);

        const numSpokes = 16;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 16);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            
            spoke.position.x = Math.cos(angle) * 1.4;
            spoke.position.y = Math.sin(angle) * 1.4;
            spoke.position.z = 0;
            
            spoke.rotation.z = angle + Math.PI / 2;
            
            // Complex inner webbing
            const webGeo = new THREE.BoxGeometry(0.8, 0.05, 1.0);
            const web = new THREE.Mesh(webGeo, darkSteel);
            web.position.copy(spoke.position);
            web.rotation.z = spoke.rotation.z;
            web.position.z -= 0.5;
            
            tireGroup.add(spoke);
            tireGroup.add(web);
        }
        
        // Hubcap
        const hubcapGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.8, 32);
        const hubcap = new THREE.Mesh(hubcapGeo, steel);
        hubcap.rotation.x = Math.PI / 2;
        tireGroup.add(hubcap);

        // Bolts on hubcap
        for(let i=0; i<8; i++){
            const angle = (i / 8) * Math.PI * 2;
            const boltGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8);
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.position.x = Math.cos(angle) * 0.6;
            bolt.position.y = Math.sin(angle) * 0.6;
            bolt.position.z = 1.45;
            bolt.rotation.x = Math.PI / 2;
            tireGroup.add(bolt);
        }

        return tireGroup;
    }

    // 2. Complex Dewar Flask Generator (Using LatheGeometry)
    function createDewar(height, radius, thickness, materialType) {
        const points = [];
        const segments = 100;
        // Outer contour
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const y = t * height;
            // Bulbous bottom, straight top, flared lip
            let x = radius;
            if (t < 0.2) {
                // Spherical bottom
                const angle = (t / 0.2) * (Math.PI / 2);
                x = radius * Math.sin(angle);
            } else if (t > 0.95) {
                // Flared lip
                x = radius + (t - 0.95) * 20.0 * radius * 0.1;
            }
            points.push(new THREE.Vector2(x, y));
        }
        // Inner contour (creating the vacuum jacket thickness)
        for (let i = segments; i >= 0; i--) {
            const t = i / segments;
            const y = t * height;
            let x = radius - thickness;
            if (t < 0.2) {
                const angle = (t / 0.2) * (Math.PI / 2);
                x = (radius - thickness) * Math.sin(angle);
            } else if (t > 0.95) {
                x = (radius - thickness) + (t - 0.95) * 20.0 * (radius - thickness) * 0.1;
            }
            // slight drop for the inner lip to seal
            points.push(new THREE.Vector2(x, y - (i === segments ? thickness : 0)));
        }
        
        const dewarGeo = new THREE.LatheGeometry(points, 128);
        const dewar = new THREE.Mesh(dewarGeo, materialType);
        
        // Add intricate flanges at the top
        const flangeGeo = new THREE.TorusGeometry(radius * 1.15, thickness * 1.5, 16, 128);
        const flange = new THREE.Mesh(flangeGeo, steel);
        flange.rotation.x = Math.PI / 2;
        flange.position.y = height;
        dewar.add(flange);
        
        // Add vacuum seal valve
        const valveGeo = new THREE.CylinderGeometry(thickness, thickness, radius * 0.5, 16);
        const valve = new THREE.Mesh(valveGeo, chrome);
        valve.position.set(radius, height * 0.8, 0);
        valve.rotation.z = Math.PI / 2;
        dewar.add(valve);

        return dewar;
    }

    // 3. Heater Coil Generator (Using TubeGeometry over a custom Curve)
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            const y = t * this.height;
            return optionalTarget.set(x, y, z);
        }
    }
    
    function createHeaterCoil() {
        const helix = new HelixCurve(0.8, 3.0, 15);
        const tubeGeo = new THREE.TubeGeometry(helix, 300, 0.05, 16, false);
        const coil = new THREE.Mesh(tubeGeo, neonMaterial);
        
        // Add electrical leads
        const leadGeo = new THREE.CylinderGeometry(0.08, 0.08, 15.0, 16);
        const lead1 = new THREE.Mesh(leadGeo, copper);
        lead1.position.set(0.8, 7.5, 0);
        
        const lead2 = new THREE.Mesh(leadGeo, copper);
        lead2.position.set(-0.8, 7.5, 0);
        
        const heaterGroup = new THREE.Group();
        heaterGroup.add(coil);
        heaterGroup.add(lead1);
        heaterGroup.add(lead2);
        
        // Add ceramic spacers
        for(let i=0; i<=3; i++) {
            const spacerGeo = new THREE.BoxGeometry(2.0, 0.2, 0.5);
            const spacer = new THREE.Mesh(spacerGeo, plastic);
            spacer.position.y = i * 1.0;
            heaterGroup.add(spacer);
        }

        return heaterGroup;
    }

    // 4. Hydraulic Stabilizer Generator
    function createHydraulicStrut() {
        const strutGroup = new THREE.Group();
        
        const outerCylGeo = new THREE.CylinderGeometry(0.6, 0.6, 6.0, 32);
        const outerCyl = new THREE.Mesh(outerCylGeo, darkSteel);
        outerCyl.position.y = 3.0;
        strutGroup.add(outerCyl);
        
        const innerCylGeo = new THREE.CylinderGeometry(0.3, 0.3, 6.0, 32);
        const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
        innerCyl.position.y = 6.0;
        // We will animate the inner cylinder
        strutGroup.userData.piston = innerCyl;
        strutGroup.add(innerCyl);
        
        const mountGeo = new THREE.BoxGeometry(1.5, 0.5, 1.5);
        const mount = new THREE.Mesh(mountGeo, steel);
        mount.position.y = 9.0;
        innerCyl.add(mount);
        
        // Hydraulic fluid lines
        const hoseCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0.6, 1.0, 0),
            new THREE.Vector3(2.0, 3.0, 0),
            new THREE.Vector3(1.0, 5.0, 0)
        );
        const hoseGeo = new THREE.TubeGeometry(hoseCurve, 20, 0.1, 8, false);
        const hose = new THREE.Mesh(hoseGeo, rubber);
        strutGroup.add(hose);

        return strutGroup;
    }

    // 5. Control Console Generator
    function createControlConsole() {
        const consoleGroup = new THREE.Group();
        
        // Main body
        const bodyGeo = new THREE.BoxGeometry(8, 4, 3);
        const body = new THREE.Mesh(bodyGeo, steel);
        consoleGroup.add(body);
        
        // Screen
        const screenGeo = new THREE.PlaneGeometry(6, 2.5);
        const screen = new THREE.Mesh(screenGeo, screenMaterial);
        screen.position.set(0, 0.2, 1.51);
        consoleGroup.add(screen);
        
        // Dials and gauges
        consoleGroup.userData.dials = [];
        for(let i=0; i<4; i++) {
            const gaugeGroup = new THREE.Group();
            
            const backGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 32);
            const back = new THREE.Mesh(backGeo, darkSteel);
            back.rotation.x = Math.PI / 2;
            gaugeGroup.add(back);
            
            const needleGeo = new THREE.BoxGeometry(0.05, 0.5, 0.05);
            const needle = new THREE.Mesh(needleGeo, neonMaterial);
            needle.position.y = 0.25;
            needle.position.z = 0.15;
            gaugeGroup.add(needle);
            
            gaugeGroup.userData.needle = needle;
            consoleGroup.userData.dials.push(needle);
            
            gaugeGroup.position.set(-3 + i * 2, -1.2, 1.51);
            consoleGroup.add(gaugeGroup);
        }
        
        // Buttons
        for(let i=0; i<10; i++) {
            const btnGeo = new THREE.BoxGeometry(0.3, 0.3, 0.2);
            const btn = new THREE.Mesh(btnGeo, (i%3===0)? neonMaterial : plastic);
            btn.position.set(3.5, 1.5 - i * 0.4, 1.51);
            consoleGroup.add(btn);
        }

        return consoleGroup;
    }

    // ============================================================================
    // MACHINE ASSEMBLY
    // ============================================================================

    // --- Base Chassis & Wheels (Cryogenic Transport Cart) ---
    const chassisGeo = new THREE.BoxGeometry(18, 2, 28);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.y = 4;
    group.add(chassis);
    
    parts.push({
        name: "CryogenicTransportChassis",
        description: "Heavy-duty dark steel chassis housing the cryogenic support systems, vacuum pumps, and power supplies.",
        material: "Dark Steel",
        function: "Provides a stable, mobile base for the macroscopic quantum phenomenon demonstration.",
        assemblyOrder: 1,
        connections: ["HydraulicStabilizers", "Wheel_FL", "Wheel_FR", "Wheel_RL", "Wheel_RR"],
        failureEffect: "Structural collapse leading to catastrophic dewar breach and instantaneous boil-off.",
        cascadeFailures: ["OuterVacuumJacket", "SuperfluidBath"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Wheels
    const wheelPositions = [
        { name: "OffRoadWheel_FL", pos: [-10, 4, -10] },
        { name: "OffRoadWheel_FR", pos: [ 10, 4, -10] },
        { name: "OffRoadWheel_RL", pos: [-10, 4,  10] },
        { name: "OffRoadWheel_RR", pos: [ 10, 4,  10] }
    ];

    const wheels = [];
    wheelPositions.forEach((wp, index) => {
        const wheel = createTireSystem();
        wheel.position.set(wp.pos[0], wp.pos[1], wp.pos[2]);
        if (wp.pos[0] > 0) wheel.rotation.y = Math.PI; // Flip right side wheels
        group.add(wheel);
        wheels.push(wheel);
        
        parts.push({
            name: wp.name,
            description: "High-traction off-road tire with complex lugs and spoked cylinder rim. Essential for moving the massive apparatus over rough laboratory terrain.",
            material: "Rubber / Chrome / Aluminum",
            function: "Mobility and shock absorption.",
            assemblyOrder: 2 + index,
            connections: ["CryogenicTransportChassis"],
            failureEffect: "Loss of mobility; potential tipping hazard causing cryogen spill.",
            cascadeFailures: ["CryogenicTransportChassis"],
            originalPosition: { x: wp.pos[0], y: wp.pos[1], z: wp.pos[2] },
            explodedPosition: { x: wp.pos[0] * 1.5, y: wp.pos[1], z: wp.pos[2] * 1.5 }
        });
    });

    // --- Hydraulic Stabilizers ---
    const struts = [];
    const strutPositions = [
        { name: "Stabilizer_FL", pos: [-8, 5, -13] },
        { name: "Stabilizer_FR", pos: [ 8, 5, -13] },
        { name: "Stabilizer_RL", pos: [-8, 5,  13] },
        { name: "Stabilizer_RR", pos: [ 8, 5,  13] }
    ];
    
    strutPositions.forEach((sp, index) => {
        const strut = createHydraulicStrut();
        strut.position.set(sp.pos[0], sp.pos[1], sp.pos[2]);
        group.add(strut);
        struts.push(strut);

        parts.push({
            name: sp.name,
            description: "Precision steel hydraulic struts ensuring perfect levelness of the apparatus. Operates via high-pressure fluid displacement.",
            material: "Steel / Chrome",
            function: "Vibration isolation and leveling.",
            assemblyOrder: 6 + index,
            connections: ["CryogenicTransportChassis", "BasePedestal"],
            failureEffect: "Uncontrolled tilt causing the fountain jet to miss the recovery funnel.",
            cascadeFailures: ["ThermomechanicalSpray", "HeliumRecoveryLines"],
            originalPosition: { x: sp.pos[0], y: sp.pos[1], z: sp.pos[2] },
            explodedPosition: { x: sp.pos[0] * 1.8, y: sp.pos[1] + 5, z: sp.pos[2] * 1.8 }
        });
    });

    // --- Base Pedestal for Dewar ---
    const pedestalGeo = new THREE.CylinderGeometry(8, 9, 3, 64);
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.set(0, 15.5, 0);
    group.add(pedestal);

    parts.push({
        name: "BasePedestal",
        description: "Massive dark steel mounting platform coupling the hydraulic stabilizers to the cryogenic dewars.",
        material: "Dark Steel",
        function: "Supports the immense weight of the vacuum jackets and liquid cryogens.",
        assemblyOrder: 10,
        connections: ["Stabilizer_FL", "Stabilizer_FR", "OuterVacuumJacket"],
        failureEffect: "Catastrophic mechanical sheer.",
        cascadeFailures: ["OuterVacuumJacket"],
        originalPosition: { x: 0, y: 15.5, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // --- The Cryogenic Dewars ---
    
    // 1. Outer Vacuum Jacket
    const outerDewar = createDewar(25, 7, 0.4, glass);
    outerDewar.position.set(0, 17, 0);
    group.add(outerDewar);
    
    parts.push({
        name: "OuterVacuumJacket",
        description: "Lathe-turned transparent glass outer dewar. Evacuated to high vacuum (10^-7 Torr) to prevent convective and conductive heat transfer.",
        material: "Glass",
        function: "Thermal isolation from ambient room temperature.",
        assemblyOrder: 11,
        connections: ["BasePedestal", "NitrogenThermalShield"],
        failureEffect: "Vacuum degradation leading to massive heat leak.",
        cascadeFailures: ["InnerHeliumDewar", "SuperfluidBath"],
        originalPosition: { x: 0, y: 17, z: 0 },
        explodedPosition: { x: -15, y: 17, z: 0 }
    });

    // 2. LN2 Thermal Shield
    const ln2ShieldGeo = new THREE.CylinderGeometry(6.2, 6.2, 23, 64, 1, true);
    const ln2Shield = new THREE.Mesh(ln2ShieldGeo, tinted);
    ln2Shield.position.set(0, 28.5, 0);
    group.add(ln2Shield);

    parts.push({
        name: "NitrogenThermalShield",
        description: "Tinted cylindrical shield cooled by liquid nitrogen (77 K) to intercept blackbody radiation.",
        material: "Tinted Copper",
        function: "Radiative thermal shielding.",
        assemblyOrder: 12,
        connections: ["OuterVacuumJacket", "InnerHeliumDewar"],
        failureEffect: "Increased radiative heat load on the inner helium bath.",
        cascadeFailures: ["SuperfluidBath"],
        originalPosition: { x: 0, y: 28.5, z: 0 },
        explodedPosition: { x: -30, y: 28.5, z: 0 }
    });

    // 3. Inner Helium Dewar
    const innerDewar = createDewar(22, 5.5, 0.3, glass);
    innerDewar.position.set(0, 18, 0);
    group.add(innerDewar);

    parts.push({
        name: "InnerHeliumDewar",
        description: "Inner glass vessel containing the liquid Helium-4 bath. Features silvered strips for visibility while maintaining radiation shielding.",
        material: "Glass",
        function: "Primary containment for liquid Helium.",
        assemblyOrder: 13,
        connections: ["NitrogenThermalShield", "SuperfluidBath"],
        failureEffect: "Immediate explosive boil-off of liquid helium (expansion ratio 1:757).",
        cascadeFailures: ["SuperfluidBath", "SuperleakPlug"],
        originalPosition: { x: 0, y: 18, z: 0 },
        explodedPosition: { x: 0, y: 18, z: -20 }
    });

    // --- The Superfluid Helium Content ---

    // Bulk Bath
    const bathGeo = new THREE.CylinderGeometry(5.1, 5.1, 10, 64);
    const bath = new THREE.Mesh(bathGeo, superfluidMaterial);
    bath.position.set(0, 23, 0);
    group.add(bath);

    parts.push({
        name: "SuperfluidBath",
        description: "The bulk liquid Helium-4. Below the Lambda point (2.17 K), a macroscopic fraction condenses into the quantum ground state, flowing with absolutely zero viscosity.",
        material: "Liquid He II (Custom Shader)",
        function: "Working fluid for the thermomechanical fountain effect.",
        assemblyOrder: 14,
        connections: ["InnerHeliumDewar", "SuperleakPlug"],
        failureEffect: "Phase transition to normal fluid He I; cessation of all quantum flow effects.",
        cascadeFailures: ["ThermomechanicalSpray", "RollinFilm"],
        originalPosition: { x: 0, y: 23, z: 0 },
        explodedPosition: { x: 0, y: 23, z: -35 }
    });

    // Creeping Rollin Film
    const filmGeo = new THREE.CylinderGeometry(5.2, 5.2, 12, 64, 32, true);
    const film = new THREE.Mesh(filmGeo, rollinFilmMaterial);
    film.position.set(0, 24, 0);
    group.add(film);

    parts.push({
        name: "RollinFilm",
        description: "A 30-nanometer thick creeping film of superfluid helium moving up the dewar walls against gravity due to Van der Waals forces.",
        material: "Iridescent He II Film (Custom Shader)",
        function: "Demonstrates frictionless fluid flow coating all surfaces in contact with the bath.",
        assemblyOrder: 15,
        connections: ["SuperfluidBath", "InnerHeliumDewar"],
        failureEffect: "Film evaporates if local temperature exceeds T_lambda.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 24, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // --- The Fountain Apparatus ---

    // 1. Capillary Stem
    const capillaryGeo = new THREE.CylinderGeometry(0.8, 0.8, 18, 32);
    const capillary = new THREE.Mesh(capillaryGeo, glass);
    capillary.position.set(0, 27, 0);
    group.add(capillary);

    parts.push({
        name: "CapillaryFountainTube",
        description: "Central glass stem directing the high-pressure superfluid upwards.",
        material: "Glass",
        function: "Vertical transport channel for the fountain jet.",
        assemblyOrder: 16,
        connections: ["SuperleakPlug", "FountainNozzle"],
        failureEffect: "Fracture disrupts the pressure differential.",
        cascadeFailures: ["ThermomechanicalSpray"],
        originalPosition: { x: 0, y: 27, z: 0 },
        explodedPosition: { x: 20, y: 27, z: 0 }
    });

    // 2. Superleak Porous Plug
    const plugGeo = new THREE.CylinderGeometry(0.7, 0.7, 2, 32);
    // Displace vertices to simulate porous packed powder
    const posAttribute = plugGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        // Add extreme high frequency noise displacement
        const noise = (Math.sin(x * 100) + Math.cos(y * 100) + Math.sin(z * 100)) * 0.02;
        posAttribute.setXYZ(i, x + noise, y + noise, z + noise);
    }
    plugGeo.computeVertexNormals();
    const superleak = new THREE.Mesh(plugGeo, darkSteel);
    superleak.position.set(0, 19, 0);
    group.add(superleak);

    parts.push({
        name: "SuperleakPlug",
        description: "Tightly packed emery powder acting as a semi-permeable membrane. The microscopic pores are so small that only the zero-viscosity superfluid component can pass through, blocking the normal fluid.",
        material: "Packed Emery Powder",
        function: "Entropy filter separating superfluid from normal fluid components.",
        assemblyOrder: 17,
        connections: ["SuperfluidBath", "CapillaryFountainTube"],
        failureEffect: "Clogging or pore expansion allows normal fluid to pass, destroying the fountain pressure gradient.",
        cascadeFailures: ["ThermomechanicalSpray"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: 25, y: 19, z: 0 }
    });

    // 3. Heater Coil
    const heater = createHeaterCoil();
    heater.position.set(0, 19.5, 0);
    group.add(heater);

    parts.push({
        name: "HeaterCoilHelix",
        description: "Copper helical coil embedded just above the superleak. By locally raising the temperature, it converts superfluid into normal fluid, creating an osmotic-like pressure gradient (Thermomechanical Effect).",
        material: "Copper / Glowing Neon",
        function: "Drives the fountain by establishing a temperature gradient (Delta T).",
        assemblyOrder: 18,
        connections: ["SuperleakPlug", "InstrumentationPanel"],
        failureEffect: "Heater burnout; fountain effect immediately ceases.",
        cascadeFailures: ["ThermomechanicalSpray"],
        originalPosition: { x: 0, y: 19.5, z: 0 },
        explodedPosition: { x: 30, y: 19.5, z: 0 }
    });

    // 4. Fountain Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.8, 2, 32);
    const nozzle = new THREE.Mesh(nozzleGeo, chrome);
    nozzle.position.set(0, 37, 0);
    group.add(nozzle);

    parts.push({
        name: "FountainNozzle",
        description: "Chrome-plated precision nozzle accelerating the superfluid jet.",
        material: "Chrome",
        function: "Shapes the superfluid stream into a continuous macroscopic fountain.",
        assemblyOrder: 19,
        connections: ["CapillaryFountainTube"],
        failureEffect: "Turbulent flow disrupts the aesthetic quantum jet.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 37, z: 0 },
        explodedPosition: { x: 20, y: 37, z: 0 }
    });

    // --- Thermomechanical Fountain Particle System ---
    const fountainParticleCount = 15000;
    const fountainGeo = new THREE.BufferGeometry();
    const fountainPos = new Float32Array(fountainParticleCount * 3);
    const fountainVel = new Float32Array(fountainParticleCount * 3);

    for (let i = 0; i < fountainParticleCount; i++) {
        fountainPos[i * 3] = 0;
        fountainPos[i * 3 + 1] = 38; // starts at nozzle
        fountainPos[i * 3 + 2] = 0;

        // Spherical distribution of velocities pointing upwards
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * 0.15; // tight cone
        const speed = 0.5 + Math.random() * 0.8;

        fountainVel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        fountainVel[i * 3 + 1] = Math.cos(phi) * speed * 2.5; // strong vertical push
        fountainVel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    fountainGeo.setAttribute('position', new THREE.BufferAttribute(fountainPos, 3));
    fountainGeo.setAttribute('velocity', new THREE.BufferAttribute(fountainVel, 3));

    const fountainParticleMat = new THREE.PointsMaterial({
        color: 0x88ddff,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const fountainSystem = new THREE.Points(fountainGeo, fountainParticleMat);
    group.add(fountainSystem);

    parts.push({
        name: "ThermomechanicalSpray",
        description: "The resultant fountain of liquid helium. Because it has zero viscosity, it experiences no pipe friction, spraying purely as a function of Delta P = rho * S * Delta T.",
        material: "Superfluid Particles",
        function: "Macroscopic visual proof of Bose-Einstein condensation mechanics.",
        assemblyOrder: 20,
        connections: ["FountainNozzle"],
        failureEffect: "Loss of jet pressure.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 38, z: 0 },
        explodedPosition: { x: 0, y: 55, z: 0 }
    });

    // --- Control Console & Wiring ---
    const consolePanel = createControlConsole();
    consolePanel.position.set(0, 10, 16);
    consolePanel.rotation.x = -Math.PI / 8;
    group.add(consolePanel);

    parts.push({
        name: "InstrumentationPanel",
        description: "Complex control console with glowing displays. Manages the heater power and monitors the Lambda transition (2.17 K) via advanced cryo-sensors.",
        material: "Steel / Electronics",
        function: "User interface for controlling the quantum state of the helium bath.",
        assemblyOrder: 21,
        connections: ["CryogenicTransportChassis", "WiringHarness"],
        failureEffect: "Inability to regulate heater coil, leading to uncontrollable fountain geyser.",
        cascadeFailures: ["HeaterCoilHelix"],
        originalPosition: { x: 0, y: 10, z: 16 },
        explodedPosition: { x: 0, y: 10, z: 30 }
    });

    // Wiring Harness (Complex Splines)
    const wireGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const wireCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 10, 15),
            new THREE.Vector3(-5 + i * 2, 5, 10),
            new THREE.Vector3(-3, 18, 5),
            new THREE.Vector3(0, 19, 0) // Connecting to heater coil
        );
        const wireGeo = new THREE.TubeGeometry(wireCurve, 64, 0.05, 8, false);
        const wireMesh = new THREE.Mesh(wireGeo, rubber);
        wireGroup.add(wireMesh);
    }
    group.add(wireGroup);

    parts.push({
        name: "WiringHarness",
        description: "Superconducting wiring bundle transmitting power from the console to the heater coil.",
        material: "Rubber / Niobium-Titanium",
        function: "Power transmission.",
        assemblyOrder: 22,
        connections: ["InstrumentationPanel", "HeaterCoilHelix"],
        failureEffect: "Loss of power to heater coil.",
        cascadeFailures: ["HeaterCoilHelix"],
        originalPosition: { x: 0, y: 15, z: 7 },
        explodedPosition: { x: -20, y: 15, z: 7 }
    });

    // --- Diagnostic Probes ---
    const probeGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
    const probe1 = new THREE.Mesh(probeGeo, aluminum);
    probe1.position.set(3, 23, 3);
    const probe2 = new THREE.Mesh(probeGeo, aluminum);
    probe2.position.set(-3, 23, -3);
    group.add(probe1);
    group.add(probe2);

    parts.push({
        name: "DiagnosticProbes",
        description: "High-precision Ruthenium Oxide temperature sensors calibrated for the milliKelvin regime.",
        material: "Aluminum / Ruthenium Oxide",
        function: "Provides real-time measurement of the He I to He II phase transition.",
        assemblyOrder: 23,
        connections: ["SuperfluidBath", "WiringHarness"],
        failureEffect: "Loss of temperature telemetry.",
        cascadeFailures: [],
        originalPosition: { x: 3, y: 23, z: 3 },
        explodedPosition: { x: 15, y: 35, z: 15 }
    });


    // ============================================================================
    // ANIMATION & LOGIC
    // ============================================================================

    const animate = (time, speed, meshes) => {
        const t = time * 0.001 * speed; // Convert ms to seconds

        // 1. Wheel Rotation (if cart is moving, just spin them slightly for effect)
        wheels.forEach(wheel => {
            wheel.rotation.z = -t * 0.5;
        });

        // 2. Hydraulic Micro-adjustments
        struts.forEach((strut, index) => {
            if (strut.userData.piston) {
                // Sine wave based on index for independent adjustments
                strut.userData.piston.position.y = 6.0 + Math.sin(t * 2.0 + index) * 0.2;
            }
        });

        // 3. Rollin Film Shaders
        rollinFilmUniforms.time.value = t;
        // Pulse the thickness based on heater power
        rollinFilmUniforms.thickness.value = 0.02 + Math.sin(t * 5.0) * 0.01;

        // 4. Heater Coil Pulsing
        // Modulate emissive intensity to simulate thermal cycling
        const heaterIntensity = (Math.sin(t * 3.0) + 1.0) * 0.5; // 0.0 to 1.0
        neonMaterial.emissiveIntensity = 1.0 + heaterIntensity * 3.0;
        neonMaterial.emissive.setHSL(0.0, 1.0, 0.3 + heaterIntensity * 0.4);

        // 5. Console Dials
        if (consolePanel.userData.dials) {
            consolePanel.userData.dials.forEach((needle, i) => {
                // Random jittery needle movement + sine base
                needle.rotation.z = Math.sin(t * (1.0 + i)) * 0.5 + (Math.random() - 0.5) * 0.1;
            });
        }

        // 6. Thermomechanical Fountain Particle Physics
        const positions = fountainGeo.attributes.position.array;
        const velocities = fountainGeo.attributes.velocity.array;

        // The jet height depends on the heater intensity
        const baseGravity = 0.05;
        const currentJetPower = 0.5 + heaterIntensity * 1.5;

        for (let i = 0; i < fountainParticleCount; i++) {
            // Apply velocity to position
            positions[i * 3] += velocities[i * 3] * currentJetPower;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * currentJetPower;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * currentJetPower;

            // Apply gravity to Y velocity
            velocities[i * 3 + 1] -= baseGravity;

            // Check collision with the bath surface (y = 28 roughly)
            if (positions[i * 3 + 1] < 28) {
                // Reset to nozzle position
                positions[i * 3] = (Math.random() - 0.5) * 0.2;
                positions[i * 3 + 1] = 38;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

                // Reset velocities
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * 0.15;
                const speedMult = 0.5 + Math.random() * 0.8;

                velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speedMult;
                velocities[i * 3 + 1] = Math.cos(phi) * speedMult * 2.5; 
                velocities[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speedMult;
            }
        }
        fountainGeo.attributes.position.needsUpdate = true;
    };

    // ============================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the fountain effect shown, how is the thermomechanical pressure difference mathematically related to the temperature gradient established by the heater coil?",
            options: [
                "It is proportional to the normal fluid density: ΔP = ρ_n S ΔT",
                "It is governed by the London equation: ΔP = ρ S ΔT, where ρ is the total density and S is the specific entropy.",
                "It follows the standard ideal gas law expansion: ΔP = nRΔT / V",
                "It is inversely proportional to the specific heat capacity: ΔP = ρ / (C_v ΔT)"
            ],
            correctAnswer: 1,
            explanation: "The thermomechanical effect is described by the London equation (ΔP = ρ S ΔT). The pressure difference arises because the superfluid moves toward the heat source to minimize the free energy gradient, carrying zero entropy, while the total density and specific entropy determine the macroscopic pressure."
        },
        {
            question: "The Two-Fluid Model (proposed by Tisza and Landau) describes liquid Helium below 2.17 K as an interpenetrating mixture of normal fluid and superfluid. As the temperature approaches absolute zero, what happens to the density fractions?",
            options: [
                "The superfluid fraction ρ_s/ρ approaches 1, and the normal fraction ρ_n/ρ approaches 0.",
                "Both fractions equalize at 0.5 due to zero-point energy fluctuations.",
                "The normal fluid fraction ρ_n/ρ approaches 1 as phonons freeze out.",
                "The superfluid fraction condenses into a solid crystal lattice (supersolid)."
            ],
            correctAnswer: 0,
            explanation: "As T approaches 0 K, the thermal excitations (phonons and rotons) that constitute the normal fluid diminish to zero. Thus, the normal fraction ρ_n approaches 0, and the liquid becomes 100% superfluid."
        },
        {
            question: "The Rollin film creeping up the walls of the inner dewar is a direct consequence of zero viscosity and which classical force?",
            options: [
                "The Coriolis effect.",
                "Casimir forces between the vacuum jacket walls.",
                "Van der Waals forces between the helium atoms and the substrate wall.",
                "Electromagnetic repulsion from the heater coil."
            ],
            correctAnswer: 2,
            explanation: "Van der Waals forces attract the helium atoms to the wall, causing the liquid to coat the surface. Because the superfluid has strictly zero viscosity, there is no internal friction to oppose this spreading, allowing the film to creep uphill against gravity up to 30 nm thick."
        },
        {
            question: "If we were to rotate the entire cryogenic apparatus uniformly, the superfluid component would initially remain stationary. If rotation speed increases, how does the superfluid eventually acquire angular momentum?",
            options: [
                "Through standard viscous drag from the normal fluid component.",
                "By nucleating a lattice of quantized vortices, each carrying a quantum of circulation κ = h/m.",
                "By transitioning into a Bose-Einstein condensate of rotons.",
                "The superfluid cannot acquire angular momentum under any circumstances."
            ],
            correctAnswer: 1,
            explanation: "A pure superfluid is entirely irrotational (∇ × v_s = 0). It can only acquire angular momentum by forming topological defects known as quantized vortices. Each vortex carries exactly one quantum of circulation, κ = h/m, where m is the mass of a Helium-4 atom. This forms an Abrikosov-like vortex lattice."
        },
        {
            question: "In standard fluids, heat propagates via diffusion. In this superfluid helium apparatus, how does heat (entropy) propagate through the bulk liquid?",
            options: [
                "Via ballistic transport of individual Helium-4 nuclei.",
                "Through standard radiative emission in the infrared spectrum.",
                "As a thermal wave called 'Second Sound', which is a density wave of the normal fluid component.",
                "Via rapid convection currents driven by the fountain effect."
            ],
            correctAnswer: 2,
            explanation: "In superfluid helium, fluctuations in temperature and entropy propagate as a wave phenomenon known as Second Sound. It involves the normal fluid and superfluid components oscillating exactly out of phase, so there is no net mass flow, only an oscillation of the local entropy and temperature."
        }
    ];

    return {
        group,
        parts,
        description: "An Ultra God-Tier macroscopic demonstration of Superfluid Helium-4. Features a heavy-duty cryogenic transport chassis, multi-stage vacuum-jacketed dewars, and a thermomechanical (fountain effect) apparatus driven by an internal heater, demonstrating zero-viscosity quantum flow and creeping Rollin film.",
        quizQuestions,
        animate
    };
}
