import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // =========================================================================
    // MATERIAL DEFINITIONS & SHADERS
    // =========================================================================
    
    // Custom high-tech materials for the Neutronium Alchemist Forge
    const blindingCoreMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        emissive: 0xaaddff, 
        emissiveIntensity: 15.0, 
        transparent: true, 
        opacity: 0.95, 
        roughness: 0.05, 
        metalness: 0.9 
    });
    
    const superDenseMat = new THREE.MeshStandardMaterial({ 
        color: 0x050505, 
        emissive: 0x020211, 
        emissiveIntensity: 0.8, 
        roughness: 0.95, 
        metalness: 1.0 
    });
    
    const plasmaContainmentMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ffff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 4.0, 
        transparent: true, 
        opacity: 0.3, 
        transmission: 0.95, 
        roughness: 0.1, 
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const magneticCoilMat = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        emissive: 0xff5500, 
        emissiveIntensity: 2.0, 
        metalness: 0.85, 
        roughness: 0.2 
    });
    
    const heavyArmorMat = new THREE.MeshStandardMaterial({ 
        color: 0x1f1f22, 
        metalness: 0.95, 
        roughness: 0.8 
    });
    
    const heatRadiatorMat = new THREE.MeshStandardMaterial({ 
        color: 0x330000, 
        emissive: 0xff1100, 
        emissiveIntensity: 1.2, 
        metalness: 0.7, 
        roughness: 0.5 
    });
    
    const glowingFluidMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00ff00, 
        emissive: 0x00ff55, 
        emissiveIntensity: 2.5, 
        transparent: true, 
        opacity: 0.8,
        transmission: 0.8 
    });
    
    const energyConduitMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 5.0 
    });

    const quantumSensorMat = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 3.0,
        metalness: 0.9,
        roughness: 0.1
    });

    // =========================================================================
    // ANIMATION STATE REPOSITORY
    // =========================================================================
    
    group.userData.animatedParts = {
        coreInner: null,
        coreOuter: null,
        stabilizingRings: [],
        magCoils: [],
        pressArms: [],
        funnel: null,
        radiatorFins: [],
        wheels: [],
        turbines: [],
        warningLights: [],
        fluidPumps: [],
        extractionArms: [],
        energyConduits: [],
        sensorArrays: []
    };

    // =========================================================================
    // SUB-ASSEMBLY BUILDERS
    // =========================================================================

    function buildBaseChassis() {
        const chassisGroup = new THREE.Group();
        
        // Massive Hexagonal Base
        const chassisShape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const r = 110;
            if (i === 0) chassisShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else chassisShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        chassisShape.closePath();

        const extrudeSettings = { 
            depth: 25, 
            bevelEnabled: true, 
            bevelSegments: 6, 
            steps: 4, 
            bevelSize: 4, 
            bevelThickness: 4 
        };
        
        const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
        const chassis = new THREE.Mesh(chassisGeo, heavyArmorMat);
        chassis.rotation.x = -Math.PI / 2;
        chassis.position.y = 20;
        chassisGroup.add(chassis);

        // Core containment well
        const wellGeo = new THREE.CylinderGeometry(40, 30, 26, 64);
        const well = new THREE.Mesh(wellGeo, darkSteel);
        well.position.y = 32.5;
        chassisGroup.add(well);

        // Structural Support Struts
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const strutGeo = new THREE.BoxGeometry(6, 40, 20);
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(Math.cos(angle) * 80, 40, Math.sin(angle) * 80);
            strut.rotation.y = -angle;
            strut.rotation.x = Math.PI / 8;
            chassisGroup.add(strut);
        }

        group.add(chassisGroup);
    }

    function buildCrawlerTracks() {
        // God Tier Mobile Transporter Chassis required to move the Forge
        const wheelConfigs = [
            {x: 80, z: 80}, {x: 80, z: -80}, 
            {x: -80, z: 80}, {x: -80, z: -80},
            {x: 100, z: 30}, {x: 100, z: -30}, 
            {x: -100, z: 30}, {x: -100, z: -30}
        ];

        wheelConfigs.forEach((cfg) => {
            const wheelGroup = new THREE.Group();
            wheelGroup.position.set(cfg.x, 20, cfg.z);

            // Rim Generation
            const rimGeo = new THREE.CylinderGeometry(16, 16, 14, 64);
            const rim = new THREE.Mesh(rimGeo, darkSteel);
            rim.rotation.x = Math.PI / 2;
            wheelGroup.add(rim);

            // Complex Spoke Array
            const numSpokes = 16;
            for (let i = 0; i < numSpokes; i++) {
                const spokeGeo = new THREE.CylinderGeometry(1.5, 1.5, 16, 16);
                const spoke = new THREE.Mesh(spokeGeo, steel);
                const angle = (i * Math.PI * 2) / numSpokes;
                spoke.position.x = Math.cos(angle) * 8;
                spoke.position.y = Math.sin(angle) * 8;
                spoke.rotation.z = angle - Math.PI / 2;
                wheelGroup.add(spoke);
            }

            // High-Tech Torus Tire
            const tireGeo = new THREE.TorusGeometry(20, 6, 48, 120);
            const tire = new THREE.Mesh(tireGeo, rubber);
            wheelGroup.add(tire);

            // Aggressive Off-road Treads (Lugs)
            const numLugs = 144;
            for(let i=0; i<numLugs; i++) {
                const lugGeo = new THREE.BoxGeometry(4.5, 3.5, 15);
                const lug = new THREE.Mesh(lugGeo, rubber);
                const angle = (i * Math.PI * 2) / numLugs;
                lug.position.x = Math.cos(angle) * 25.5;
                lug.position.y = Math.sin(angle) * 25.5;
                lug.rotation.z = angle;
                wheelGroup.add(lug);
            }

            // Central Hub mechanism
            const hubGeo = new THREE.CylinderGeometry(5, 5, 18, 32);
            const hub = new THREE.Mesh(hubGeo, chrome);
            hub.rotation.x = Math.PI / 2;
            wheelGroup.add(hub);

            // Shock Absorbers attaching to chassis
            const shockGeo = new THREE.CylinderGeometry(3, 3, 25, 16);
            const shock = new THREE.Mesh(shockGeo, steel);
            shock.position.y = 12.5;
            wheelGroup.add(shock);

            group.add(wheelGroup);
            group.userData.animatedParts.wheels.push(wheelGroup);
        });
    }

    function buildReactorCore() {
        const coreGroup = new THREE.Group();
        coreGroup.position.set(0, 70, 0);

        // Blinding inner degenerate matter core
        const innerCoreGeo = new THREE.IcosahedronGeometry(10, 5); 
        const innerCore = new THREE.Mesh(innerCoreGeo, blindingCoreMat);
        coreGroup.add(innerCore);
        group.userData.animatedParts.coreInner = innerCore;

        // Plasma Containment Shell
        const outerPlasmaGeo = new THREE.IcosahedronGeometry(15, 4);
        const outerPlasma = new THREE.Mesh(outerPlasmaGeo, plasmaContainmentMat);
        coreGroup.add(outerPlasma);
        group.userData.animatedParts.coreOuter = outerPlasma;

        // Gyroscopic Stabilizing Rings
        for(let i=0; i<4; i++) {
            const ringGeo = new THREE.TorusGeometry(18 + i*2.5, 0.8, 32, 128);
            const ring = new THREE.Mesh(ringGeo, blindingCoreMat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            coreGroup.add(ring);
            group.userData.animatedParts.stabilizingRings.push(ring);
        }

        group.add(coreGroup);
    }

    function buildMagneticConfinement() {
        const magContainmentGroup = new THREE.Group();
        magContainmentGroup.position.set(0, 70, 0);

        // Primary Massive Torus Shell
        const magTorusGeo = new THREE.TorusGeometry(32, 5, 64, 128);
        const magTorus = new THREE.Mesh(magTorusGeo, heavyArmorMat);
        magTorus.rotation.x = Math.PI / 2;
        magContainmentGroup.add(magTorus);

        // Radial Magnetic Coils wrapped around the Torus
        const numCoils = 48;
        for(let i=0; i<numCoils; i++) {
            const coilGroup = new THREE.Group();
            
            const coilGeo = new THREE.TorusGeometry(6, 1.8, 32, 64);
            const coil = new THREE.Mesh(coilGeo, magneticCoilMat);
            
            const angle = (i * Math.PI * 2) / numCoils;
            coilGroup.position.x = Math.cos(angle) * 32;
            coilGroup.position.z = Math.sin(angle) * 32;
            coilGroup.rotation.y = -angle; 
            
            coilGroup.add(coil);

            // Micro-detailing on each coil
            const heatsinkGeo = new THREE.BoxGeometry(2, 14, 2);
            const heatsink = new THREE.Mesh(heatsinkGeo, darkSteel);
            heatsink.position.x = 7;
            coilGroup.add(heatsink);

            magContainmentGroup.add(coilGroup);
            group.userData.animatedParts.magCoils.push(coil);
        }

        // Secondary inner confinement ring
        const innerMagGeo = new THREE.TorusGeometry(22, 2, 32, 64);
        const innerMag = new THREE.Mesh(innerMagGeo, chrome);
        innerMag.rotation.x = Math.PI / 2;
        magContainmentGroup.add(innerMag);

        group.add(magContainmentGroup);
    }

    function buildPresses() {
        // Four immense gravimetric presses that slam inward to crush matter
        const pressAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
        
        pressAngles.forEach((angle, index) => {
            const pressGroup = new THREE.Group();
            pressGroup.position.set(Math.cos(angle)*50, 60, Math.sin(angle)*50);
            pressGroup.rotation.y = -angle + Math.PI; 

            // Massive Base Mount
            const mountGeo = new THREE.CylinderGeometry(12, 18, 20, 64);
            const mount = new THREE.Mesh(mountGeo, heavyArmorMat);
            mount.position.y = -10;
            pressGroup.add(mount);
            
            // Heavy Hinge Assembly
            const hingeGeo = new THREE.CylinderGeometry(8, 8, 24, 64);
            const hinge = new THREE.Mesh(hingeGeo, darkSteel);
            hinge.rotation.x = Math.PI / 2;
            pressGroup.add(hinge);

            // Boom Pivot Group
            const boomPivot = new THREE.Group();
            pressGroup.add(boomPivot);

            // Intricate Truss Boom Arm
            const boomShape = new THREE.Shape();
            boomShape.moveTo(-8, 0);
            boomShape.lineTo(8, 0);
            boomShape.lineTo(5, 50);
            boomShape.lineTo(-5, 50);
            boomShape.lineTo(-8, 0);
            
            const boomExtSettings = { depth: 14, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
            const boomGeo = new THREE.ExtrudeGeometry(boomShape, boomExtSettings);
            boomGeo.translate(0, 0, -7); 
            const boom = new THREE.Mesh(boomGeo, copper);
            boomPivot.add(boom);

            // Truss cutouts and structural panels
            for(let i=0; i<4; i++) {
               const panelGeo = new THREE.BoxGeometry(8, 6, 16);
               const panel = new THREE.Mesh(panelGeo, heavyArmorMat);
               panel.position.set(0, 10 + i*10, 0);
               boom.add(panel);
            }

            // Head Pivot Group
            const headPivot = new THREE.Group();
            headPivot.position.y = 50; 
            boomPivot.add(headPivot);

            // Gravimetric Press Head
            const headGeo = new THREE.CylinderGeometry(15, 20, 25, 64);
            const head = new THREE.Mesh(headGeo, darkSteel);
            head.rotation.x = Math.PI / 2; 
            head.position.z = 12.5;
            headPivot.add(head);

            // Graviton Emitter Array on Head
            const emitterGeo = new THREE.CylinderGeometry(12, 12, 2, 32);
            const emitter = new THREE.Mesh(emitterGeo, blindingCoreMat);
            emitter.rotation.x = Math.PI / 2;
            emitter.position.z = 26;
            headPivot.add(emitter);

            // Extreme Hydraulics System
            const pistonCylGeo = new THREE.CylinderGeometry(4, 4, 35, 32);
            pistonCylGeo.translate(0, 17.5, 0);
            const pistonCyl = new THREE.Mesh(pistonCylGeo, steel);
            pistonCyl.position.set(0, -5, 12);
            pistonCyl.rotation.x = 0.3; 
            pressGroup.add(pistonCyl);

            const pistonRodGeo = new THREE.CylinderGeometry(2.5, 2.5, 35, 32);
            pistonRodGeo.translate(0, 17.5, 0);
            const pistonRod = new THREE.Mesh(pistonRodGeo, chrome);
            pistonRod.position.set(0, 15, 0); 
            pistonCyl.add(pistonRod);

            group.add(pressGroup);
            group.userData.animatedParts.pressArms.push({
                boomPivot,
                headPivot,
                pistonRod
            });
        });
    }

    function buildRadiatorArrays() {
        const radiatorGroup = new THREE.Group();
        radiatorGroup.position.set(0, 45, 0);
        
        for(let i=0; i<6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const radBase = new THREE.Group();
            radBase.position.x = Math.cos(angle) * 105;
            radBase.position.z = Math.sin(angle) * 105;
            radBase.rotation.y = -angle;

            const radFrameGeo = new THREE.BoxGeometry(14, 60, 30);
            const radFrame = new THREE.Mesh(radFrameGeo, darkSteel);
            radFrame.position.y = 10;
            radBase.add(radFrame);

            // Thermal Fins
            for(let j=0; j<35; j++) {
                const finGeo = new THREE.BoxGeometry(18, 0.8, 26);
                const fin = new THREE.Mesh(finGeo, heatRadiatorMat);
                fin.position.y = -18 + j * 1.6;
                radBase.add(fin);
                group.userData.animatedParts.radiatorFins.push(fin);
            }
            
            // Exhaust Stacks
            const exhaustGeo = new THREE.CylinderGeometry(3, 3, 20, 16);
            const exhaust = new THREE.Mesh(exhaustGeo, chrome);
            exhaust.position.set(0, 45, 0);
            radBase.add(exhaust);

            radiatorGroup.add(radBase);
        }
        group.add(radiatorGroup);
    }

    function buildPipingNetworks() {
        // Complex Spline-based piping logic
        
        // Primary Coolant Pipes (Liquid Helium-3)
        for(let i=0; i<24; i++) {
            const angle = (i * Math.PI * 2) / 24;
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(angle)*20, 70, Math.sin(angle)*20),
                new THREE.Vector3(Math.cos(angle)*45, 45, Math.sin(angle)*45),
                new THREE.Vector3(Math.cos(angle)*75, 30, Math.sin(angle)*75),
                new THREE.Vector3(Math.cos(angle)*100, 50, Math.sin(angle)*100)
            ]);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.5, 16, false);
            const pipe = new THREE.Mesh(tubeGeo, copper);
            group.add(pipe);
        }

        // Secondary Energy Conduits (Pulsing Cyan)
        for(let i=0; i<16; i++) {
            const angle = (i * Math.PI * 2) / 16 + 0.15;
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(angle)*30, 70, Math.sin(angle)*30),
                new THREE.Vector3(Math.cos(angle)*35, 95, Math.sin(angle)*35),
                new THREE.Vector3(Math.cos(angle)*55, 110, Math.sin(angle)*55),
                new THREE.Vector3(0, 140, 75) // Routing upwards towards Control Cabin
            ]);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.0, 16, false);
            const conduit = new THREE.Mesh(tubeGeo, energyConduitMat);
            group.add(conduit);
            group.userData.animatedParts.energyConduits.push(conduit);
        }
        
        // High-Pressure Hydraulic Lines for Presses
        const pressAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
        pressAngles.forEach(angle => {
            for(let j=0; j<6; j++) {
                const offset = (j-2.5)*2.5;
                const curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(Math.cos(angle)*45 + offset, 55, Math.sin(angle)*45 + offset),
                    new THREE.Vector3(Math.cos(angle)*50 + offset, 35, Math.sin(angle)*50 + offset),
                    new THREE.Vector3(Math.cos(angle)*70 + offset, 28, Math.sin(angle)*70 + offset)
                ]);
                const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.8, 12, false);
                const line = new THREE.Mesh(tubeGeo, rubber);
                group.add(line);
            }
        });
    }

    function buildPowerGenerators() {
        const genGroup = new THREE.Group();
        const positions = [
            {x: 75, z: 75}, {x: -75, z: 75}, {x: 75, z: -75}, {x: -75, z: -75}
        ];
        
        positions.forEach(pos => {
            const genBaseGeo = new THREE.CylinderGeometry(18, 22, 35, 64);
            const genBase = new THREE.Mesh(genBaseGeo, heavyArmorMat);
            genBase.position.set(pos.x, 42.5, pos.z);
            genGroup.add(genBase);

            const genCoreGeo = new THREE.CylinderGeometry(12, 12, 40, 64);
            const genCore = new THREE.Mesh(genCoreGeo, plasmaContainmentMat);
            genCore.position.set(pos.x, 45, pos.z);
            genGroup.add(genCore);

            // Magnetic Spin Turbines
            for(let j=0; j<4; j++) {
                const turbineGeo = new THREE.TorusGeometry(15, 2, 32, 64);
                const turbine = new THREE.Mesh(turbineGeo, chrome);
                turbine.rotation.x = Math.PI / 2;
                turbine.position.set(pos.x, 30 + j*10, pos.z);
                genGroup.add(turbine);
                group.userData.animatedParts.turbines.push(turbine);
            }

            // Exhaust Caps
            const capGeo = new THREE.ConeGeometry(18, 15, 64);
            const cap = new THREE.Mesh(capGeo, darkSteel);
            cap.position.set(pos.x, 67.5, pos.z);
            genGroup.add(cap);
        });
        
        group.add(genGroup);
    }

    function buildControlCabin() {
        const cabinGroup = new THREE.Group();
        // Suspended high above, looking down at the core
        cabinGroup.position.set(0, 140, 80);

        const cabinBodyShape = new THREE.Shape();
        cabinBodyShape.moveTo(-25, 0);
        cabinBodyShape.lineTo(25, 0);
        cabinBodyShape.lineTo(35, 15);
        cabinBodyShape.lineTo(25, 30);
        cabinBodyShape.lineTo(-25, 30);
        cabinBodyShape.lineTo(-35, 15);
        cabinBodyShape.lineTo(-25, 0);
        
        const cabinExt = new THREE.ExtrudeGeometry(cabinBodyShape, {depth: 40, bevelEnabled: true, bevelSegments: 4});
        cabinExt.translate(0, 0, -20);
        const cabin = new THREE.Mesh(cabinExt, heavyArmorMat);
        cabinGroup.add(cabin);

        // Heavy Tinted Observation Windows
        const windowGeo = new THREE.PlaneGeometry(48, 12);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(0, 20, 20.5);
        cabinGroup.add(windowMesh);
        
        const sideWindowGeo = new THREE.PlaneGeometry(38, 12);
        const sideWindowLeft = new THREE.Mesh(sideWindowGeo, tinted);
        sideWindowLeft.rotation.y = -Math.PI / 2;
        sideWindowLeft.position.set(-35.5, 20, 0);
        cabinGroup.add(sideWindowLeft);

        const sideWindowRight = new THREE.Mesh(sideWindowGeo, tinted);
        sideWindowRight.rotation.y = Math.PI / 2;
        sideWindowRight.position.set(35.5, 20, 0);
        cabinGroup.add(sideWindowRight);

        // Sensor Dish Array
        const dishGeo = new THREE.SphereGeometry(8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const dish = new THREE.Mesh(dishGeo, steel);
        dish.rotation.x = Math.PI / 4;
        dish.position.set(0, 35, -10);
        cabinGroup.add(dish);
        group.userData.animatedParts.sensorArrays.push(dish);

        // Antenna Spire
        const antGeo = new THREE.CylinderGeometry(0.5, 0.5, 35, 16);
        const ant = new THREE.Mesh(antGeo, chrome);
        ant.position.set(-15, 45, 0);
        cabinGroup.add(ant);
        
        // Support Beams connecting cabin to chassis
        const beamGeo = new THREE.CylinderGeometry(3, 3, 100, 32);
        const beam1 = new THREE.Mesh(beamGeo, darkSteel);
        beam1.position.set(-15, -50, -40);
        beam1.rotation.x = -Math.PI / 6;
        cabinGroup.add(beam1);
        
        const beam2 = new THREE.Mesh(beamGeo, darkSteel);
        beam2.position.set(15, -50, -40);
        beam2.rotation.x = -Math.PI / 6;
        cabinGroup.add(beam2);

        group.add(cabinGroup);
    }

    function buildInputFunnel() {
        // Massive matter injection funnel situated directly above the core
        const funnelPoints = [];
        funnelPoints.push(new THREE.Vector2(0.5, 0));
        funnelPoints.push(new THREE.Vector2(6, 0));
        funnelPoints.push(new THREE.Vector2(10, 30));
        funnelPoints.push(new THREE.Vector2(35, 60));
        funnelPoints.push(new THREE.Vector2(45, 60));
        funnelPoints.push(new THREE.Vector2(45, 64));
        funnelPoints.push(new THREE.Vector2(0.5, 64));

        const funnelGeo = new THREE.LatheGeometry(funnelPoints, 128);
        const funnel = new THREE.Mesh(funnelGeo, steel);
        funnel.position.set(0, 100, 0);
        
        // Funnel Support Ring
        const ringGeo = new THREE.TorusGeometry(46, 2, 32, 128);
        const ring = new THREE.Mesh(ringGeo, darkSteel);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 162, 0);
        group.add(ring);

        group.add(funnel);
        group.userData.animatedParts.funnel = funnel;
    }

    function buildExtractionCrucible() {
        // High-density crucible below the core to catch and process the synthesized neutronium
        const extractorGroup = new THREE.Group();
        extractorGroup.position.set(0, 25, 0);
        
        const extCylGeo = new THREE.CylinderGeometry(15, 15, 30, 64);
        const extCyl = new THREE.Mesh(extCylGeo, heavyArmorMat);
        extractorGroup.add(extCyl);

        // Heavy-duty robotic manipulator arms for extraction
        for(let i=0; i<3; i++) {
            const angle = i * Math.PI*2/3;
            const armBaseGeo = new THREE.BoxGeometry(6, 6, 25);
            const armBase = new THREE.Mesh(armBaseGeo, chrome);
            armBase.position.set(Math.cos(angle)*18, 0, Math.sin(angle)*18);
            armBase.rotation.y = -angle;
            
            const clawGeo = new THREE.ConeGeometry(3, 10, 16);
            const claw = new THREE.Mesh(clawGeo, darkSteel);
            claw.rotation.x = -Math.PI / 2;
            claw.position.z = 15;
            armBase.add(claw);

            extractorGroup.add(armBase);
            group.userData.animatedParts.extractionArms.push(armBase);
        }
        
        group.add(extractorGroup);
    }

    function buildCatwalks() {
        // Industrial catwalks for maintenance crew
        const catwalkGroup = new THREE.Group();
        const levels = [40, 75, 110];
        
        levels.forEach(y => {
            const walkGeo = new THREE.TorusGeometry(65, 3, 8, 128);
            const walk = new THREE.Mesh(walkGeo, darkSteel);
            walk.rotation.x = Math.PI / 2;
            walk.position.y = y;
            catwalkGroup.add(walk);
            
            // Safety Railings
            const railGeo = new THREE.TorusGeometry(67.5, 0.6, 8, 128);
            const rail = new THREE.Mesh(railGeo, steel);
            rail.rotation.x = Math.PI / 2;
            rail.position.y = y + 4;
            catwalkGroup.add(rail);

            // Vertical Railing Supports
            for(let i=0; i<36; i++) {
                const angle = (i * Math.PI * 2) / 36;
                const supGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 8);
                const sup = new THREE.Mesh(supGeo, steel);
                sup.position.set(Math.cos(angle)*67.5, y + 2, Math.sin(angle)*67.5);
                catwalkGroup.add(sup);
            }
        });
        
        group.add(catwalkGroup);
    }

    function buildWarningLights() {
        const lightGroup = new THREE.Group();
        const lightGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const lightMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            emissive: 0xff0000, 
            emissiveIntensity: 5.0 
        });
        
        // Perimeter strobe lights
        for(let i=0; i<16; i++) {
            const angle = (i * Math.PI * 2) / 16;
            const light = new THREE.Mesh(lightGeo, lightMat);
            light.position.set(Math.cos(angle)*105, 55, Math.sin(angle)*105);
            lightGroup.add(light);
            group.userData.animatedParts.warningLights.push(light);
        }
        
        group.add(lightGroup);
    }

    // =========================================================================
    // EXECUTE BUILDERS
    // =========================================================================

    buildBaseChassis();
    buildCrawlerTracks();
    buildReactorCore();
    buildMagneticConfinement();
    buildPresses();
    buildRadiatorArrays();
    buildPipingNetworks();
    buildPowerGenerators();
    buildControlCabin();
    buildInputFunnel();
    buildExtractionCrucible();
    buildCatwalks();
    buildWarningLights();

    // =========================================================================
    // PART DEFINITIONS
    // =========================================================================

    const parts = [
        {
            name: "Central Core Containment Chamber",
            description: "The absolute center of the forge where localized gravitational metrics and weak-force catalysis merge. Houses the primary matter-to-neutronium conversion event.",
            material: "Hyper-Dense Neutronium-laced Adamantine",
            function: "Maintains a constant localized pressure of 10^30 Pascals. Prevents catastrophic decompression of degenerate matter.",
            assemblyOrder: 1,
            connections: ["Magnetic Toroidal Field Generator", "Gravimetric Press Arms", "Helium-3 Cooling Network"],
            failureEffect: "Immediate conversion of the immediate vicinity into a quark-gluon plasma followed by a localized supernova-scale explosion.",
            cascadeFailures: ["Entire Forge Annihilation", "Planetary Crust Compromise"],
            originalPosition: { x: 0, y: 70, z: 0 },
            explodedPosition: { x: 0, y: 150, z: 0 }
        },
        {
            name: "Magnetic Toroidal Field Generator",
            description: "An immense super-conducting electromagnet array surrounding the core, generating field strengths exceeding 10^15 Gauss.",
            material: "Yttrium Barium Copper Oxide Superconductor Shell",
            function: "Prevents the Magneto-Rayleigh-Taylor instability by confining the intermediate plasma phase dynamically.",
            assemblyOrder: 2,
            connections: ["Central Core Containment Chamber", "Fusion Power Generator Array"],
            failureEffect: "Plasma breaches containment, instantly vaporizing the forge structure via thermal radiation.",
            cascadeFailures: ["Core Containment Chamber", "Thermal Radiator Array"],
            originalPosition: { x: 0, y: 70, z: 0 },
            explodedPosition: { x: 0, y: 70, z: 50 }
        },
        {
            name: "Gravimetric Press Arm Alpha",
            description: "The primary kinetic driver. Focuses localized gravimetric fields to compress target material along the X-Z axis.",
            material: "Titanium-Tungsten Alloy",
            function: "Applies physical and gravimetric pressure synchronously with its three sister presses to induce electron capture.",
            assemblyOrder: 3,
            connections: ["Heavy Armor Chassis Base", "High-Pressure Hydraulic Lines"],
            failureEffect: "Asymmetric compression leading to a runaway localized black hole or catastrophic strangelet conversion.",
            cascadeFailures: ["Core Containment Chamber", "Magnetic Toroidal Field Generator"],
            originalPosition: { x: 35.3, y: 60, z: 35.3 },
            explodedPosition: { x: 100, y: 80, z: 100 }
        },
        {
            name: "Gravimetric Press Arm Beta",
            description: "The secondary kinetic driver. Operates in perfect unison with Alpha, Gamma, and Delta to ensure spherical symmetry.",
            material: "Titanium-Tungsten Alloy",
            function: "Drives the compression phase by slamming inward with picosecond precision.",
            assemblyOrder: 4,
            connections: ["Heavy Armor Chassis Base", "High-Pressure Hydraulic Lines"],
            failureEffect: "Loss of spherical symmetry in the core, causing lateral jetting of relativistic plasma.",
            cascadeFailures: ["Core Containment Chamber"],
            originalPosition: { x: -35.3, y: 60, z: 35.3 },
            explodedPosition: { x: -100, y: 80, z: 100 }
        },
        {
            name: "Gravimetric Press Arm Gamma",
            description: "The tertiary kinetic driver. Embedded with quantum sensors to modulate force application dynamically.",
            material: "Titanium-Tungsten Alloy",
            function: "Maintains stability during the critical transition across the Tolman-Oppenheimer-Volkoff limit threshold.",
            assemblyOrder: 5,
            connections: ["Heavy Armor Chassis Base", "Quantum Sensor Array"],
            failureEffect: "Over-compression causing unnecessary energy expenditure or premature quark confinement breakdown.",
            cascadeFailures: ["Fusion Power Generator Array"],
            originalPosition: { x: -35.3, y: 60, z: -35.3 },
            explodedPosition: { x: -100, y: 80, z: -100 }
        },
        {
            name: "Gravimetric Press Arm Delta",
            description: "The quaternary kinetic driver. Houses the backup graviton emitters.",
            material: "Titanium-Tungsten Alloy",
            function: "Seals the geometric pressure sphere, completing the omni-directional crush vector.",
            assemblyOrder: 6,
            connections: ["Heavy Armor Chassis Base", "Graviton Emitter Arrays"],
            failureEffect: "Incomplete pressure sphere, leading to 'squirting' of neutron matter out of the active zone.",
            cascadeFailures: ["Thermal Radiator Array"],
            originalPosition: { x: 35.3, y: 60, z: -35.3 },
            explodedPosition: { x: 100, y: 80, z: -100 }
        },
        {
            name: "Helium-3 Cooling Piping Network",
            description: "Extensive network of cryogenic splines pumping liquid Helium-3 to extract waste heat from the transmutation event.",
            material: "Cryo-Tempered Copper-Ceramic Composite",
            function: "Prevents the superconductor coils from quenching under the immense thermal load of inverse beta decay.",
            assemblyOrder: 7,
            connections: ["Thermal Radiator Array", "Magnetic Toroidal Field Generator"],
            failureEffect: "Coil quench resulting in instantaneous loss of magnetic confinement.",
            cascadeFailures: ["Magnetic Toroidal Field Generator", "Core Containment Chamber"],
            originalPosition: { x: 0, y: 50, z: 0 },
            explodedPosition: { x: 0, y: 20, z: -120 }
        },
        {
            name: "Heavy Armor Chassis Base",
            description: "The immense hexagonal foundation supporting the tens of thousands of metric tons of the Forge superstructure.",
            material: "Depleted Uranium reinforced Steel",
            function: "Absorbs seismic shocks and recoil forces generated by the slamming presses.",
            assemblyOrder: 8,
            connections: ["All-Terrain Crawler Treads", "Gravimetric Press Arms", "Extraction Crucible"],
            failureEffect: "Structural collapse under its own weight or kinetic recoil, crushing lower components.",
            cascadeFailures: ["Extraction Crucible", "Piping Networks"],
            originalPosition: { x: 0, y: 20, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 0 }
        },
        {
            name: "All-Terrain Crawler Treads",
            description: "Eight gigantic wheel-and-tread assemblies designed to mobilize the God Tier Forge across harsh topographies.",
            material: "Nano-Carbon infused Rubber & Steel",
            function: "Provides mobility for relocation to new resource deposits while supporting millions of tons.",
            assemblyOrder: 9,
            connections: ["Heavy Armor Chassis Base"],
            failureEffect: "Immobility, stranding the forge and subjecting it to localized geological sinking.",
            cascadeFailures: ["None"],
            originalPosition: { x: 80, y: 20, z: 80 },
            explodedPosition: { x: 150, y: 0, z: 150 }
        },
        {
            name: "Thermal Radiator Fin Array",
            description: "Towering heat exchange columns utilizing fractal fin geometries to maximize surface area.",
            material: "Thermal-conductive Carbon Nanotube matrix",
            function: "Vents terawatts of waste heat into the surrounding atmosphere, glowing cherry red during operation.",
            assemblyOrder: 10,
            connections: ["Helium-3 Cooling Piping Network"],
            failureEffect: "Thermal bottlenecking leading to localized melting of the chassis.",
            cascadeFailures: ["Piping Networks", "Fusion Power Generator Array"],
            originalPosition: { x: 105, y: 45, z: 0 },
            explodedPosition: { x: 200, y: 45, z: 0 }
        },
        {
            name: "Matter Injection Funnel",
            description: "A colossal hopper positioned above the core to receive raw normal matter (asteroids, planetary chunks).",
            material: "Hardened Steel",
            function: "Feeds raw mass into the reaction chamber continuously to maintain the continuous output of neutronium.",
            assemblyOrder: 11,
            connections: ["Central Core Containment Chamber"],
            failureEffect: "Blockage leading to matter starvation and destabilization of the core's equation of state.",
            cascadeFailures: ["Central Core Containment Chamber"],
            originalPosition: { x: 0, y: 100, z: 0 },
            explodedPosition: { x: 0, y: 250, z: 0 }
        },
        {
            name: "Neutronium Extraction Crucible",
            description: "A reinforced lower chamber that safely collects the hyper-dense, microscopically small neutronium droplets.",
            material: "Gravitationally-locked Adamantine",
            function: "Maintains a localized stasis field to prevent the extracted neutronium from explosively decaying outside the core.",
            assemblyOrder: 12,
            connections: ["Heavy Armor Chassis Base", "Central Core Containment Chamber"],
            failureEffect: "Crucible breach releases a neutronium droplet into standard atmospheric pressure, causing an extinction-level explosion.",
            cascadeFailures: ["Planetary destruction"],
            originalPosition: { x: 0, y: 25, z: 0 },
            explodedPosition: { x: 0, y: -100, z: 0 }
        },
        {
            name: "Fusion Power Generator Array",
            description: "Four massive internal confinement fusion reactors stationed at the corners of the base.",
            material: "Heavy Armor & Plasma Containment Glass",
            function: "Generates the sheer petawatts of electricity required to power the magnetic coils and gravimetric presses.",
            assemblyOrder: 13,
            connections: ["Energy Routing Conduits", "Heavy Armor Chassis Base"],
            failureEffect: "Power loss during synthesis, dropping the containment field and triggering immediate catastrophic decompression.",
            cascadeFailures: ["Magnetic Toroidal Field Generator", "Core Containment Chamber"],
            originalPosition: { x: 75, y: 45, z: 75 },
            explodedPosition: { x: 120, y: 45, z: 120 }
        },
        {
            name: "Operator Command Cabin",
            description: "Suspended far above the dangerous lower decks, heavily shielded against radiation and magnetic fluxes.",
            material: "Lead-lined Armor & Tinted Anti-radiation Glass",
            function: "Houses the master control systems, AI oversight nodes, and a terrified human crew monitoring the reaction.",
            assemblyOrder: 14,
            connections: ["Heavy Armor Chassis Base", "Energy Routing Conduits"],
            failureEffect: "Loss of manual override capabilities in the event of AI hallucination during quantum calculations.",
            cascadeFailures: ["None directly, but severely limits crisis response."],
            originalPosition: { x: 0, y: 140, z: 80 },
            explodedPosition: { x: 0, y: 200, z: 200 }
        },
        {
            name: "Energy Routing Conduits",
            description: "Pulsing cyan tubes routing pure energy from the fusion reactors directly to the magnetic confinement arrays and presses.",
            material: "Super-conductive Plasma Glass",
            function: "Ensures zero-latency power delivery to maintain millimeter-perfect synchronization of the presses.",
            assemblyOrder: 15,
            connections: ["Fusion Power Generator Array", "Magnetic Toroidal Field Generator", "Operator Command Cabin"],
            failureEffect: "Energy surge causing conduit explosion, blinding personnel and severing power to critical systems.",
            cascadeFailures: ["Magnetic Toroidal Field Generator"],
            originalPosition: { x: 0, y: 80, z: 40 },
            explodedPosition: { x: -50, y: 100, z: 50 }
        }
    ];

    const description = "The God Tier Neutronium Alchemist Forge is the pinnacle of extreme cosmological engineering. Designed to artificially synthesize macroscopic quantities of degenerate neutron matter, it utilizes four immense gravimetric presses that slam inward with petatons of force, coupled with a toroidal magnetic confinement array to prevent the intermediate plasma from undergoing Magneto-Rayleigh-Taylor instability. The core glows with blinding intensity as electrons are forced into protons via inverse beta decay. It requires staggering amounts of power, supplied by four onboard fusion reactors, and dissipates waste heat through towering fractal radiator arrays. The entire colossal structure rests on a heavy-duty crawler-transporter base, making it a mobile, planet-cracking factory of impossible physics.";

    // =========================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // =========================================================================

    const quizQuestions = [
        {
            question: "In the context of artificial neutronium synthesis via the God Tier Forge, what physical principle prevents the total gravitational collapse of the synthesized degenerate matter before reaching the Tolman-Oppenheimer-Volkoff limit?",
            options: [
                "Neutron Degeneracy Pressure mediated by the Pauli Exclusion Principle",
                "Electron Degeneracy Pressure governed by the Heisenberg Uncertainty Principle",
                "Strong Nuclear Force repulsion at ultra-short distances (< 0.7 fm)",
                "Quantum Chromodynamic Vacuum Polarization"
            ],
            correctAnswer: 0,
            explanation: "Neutron degeneracy pressure, a consequence of the Pauli Exclusion Principle which prevents identical fermions from occupying the same quantum state, is the primary force resisting collapse in neutron stars and artificial neutronium."
        },
        {
            question: "During the initial phase of matter compression in the Forge, inverse beta decay is forcefully catalyzed. What is the fundamental particle interaction driving this process?",
            options: [
                "Protons and electrons combine to form neutrons and electron neutrinos via the weak interaction",
                "Up quarks are converted directly into down quarks via strong force gluons",
                "Electrons are annihilated by artificially injected positrons, releasing binding energy",
                "Neutrinos are captured by neutrons to create stable hyperons"
            ],
            correctAnswer: 0,
            explanation: "Inverse beta decay (electron capture) occurs when extreme pressure forces electrons and protons to interact via the weak force, producing neutrons and electron neutrinos (p + e⁻ → n + νe)."
        },
        {
            question: "The Forge utilizes massive toroidal magnetic arrays to confine the high-density plasma. Which magnetohydrodynamic (MHD) instability poses the greatest catastrophic threat during maximum compression?",
            options: [
                "Magneto-Rayleigh-Taylor instability",
                "Kelvin-Helmholtz instability",
                "Cherenkov radiation feedback loop",
                "Hawking radiation evaporation"
            ],
            correctAnswer: 0,
            explanation: "The Magneto-Rayleigh-Taylor instability occurs when a magnetic field supports a heavier fluid (or high-density plasma) against gravity or acceleration, leading to catastrophic confinement breach if not dynamically stabilized."
        },
        {
            question: "At the absolute core of the Forge, if compression transiently exceeds typical nuclear saturation densities, what exotic state of matter might the equation of state (EOS) briefly permit?",
            options: [
                "Quark-Gluon Plasma or a Hyperon-mixed phase",
                "Bose-Einstein Condensate of alpha particles",
                "Superfluid Helium-3 crystal lattice",
                "Metallic Hydrogen monopole fluid"
            ],
            correctAnswer: 0,
            explanation: "At densities significantly exceeding normal nuclear density (saturation density), the neutrons may break down into a deconfined Quark-Gluon Plasma, or exotic hyperons may appear, softening the equation of state."
        },
        {
            question: "If the Forge's gravimetric containment fails and a macroscopic droplet of synthesized neutronium is suddenly exposed to standard Earth environment (1 atm, 298 K), what is the immediate consequence?",
            options: [
                "Catastrophic explosive expansion and beta decay releasing macroscopic amounts of binding energy",
                "The droplet harmlessly evaporates over millennia via Hawking radiation",
                "It falls directly to the Earth's core due to extreme density, remaining stable forever",
                "It absorbs atmospheric nitrogen, forming a stable super-heavy isotope"
            ],
            correctAnswer: 0,
            explanation: "Without immense pressure (gravitational or artificial) to maintain it, the minimum energy state strongly favors normal matter. The free neutrons would rapidly undergo beta decay (half-life ~10 minutes, but instantaneous in bulk), and the droplet would explosively decompress with a yield proportional to its mass, similar to a massive nuclear detonation."
        }
    ];

    // =========================================================================
    // ANIMATION LOOP
    // =========================================================================

    function animate(time, speed, meshes) {
        const parts = group.userData.animatedParts;
        if (!parts) return;
        
        const t = time * speed;
        
        // 1. Core Pulsing and Rotation
        if (parts.coreInner && parts.coreOuter) {
            // Intense blinding pulse synchronized with presses
            const pulsePhase = (t * 2) % (Math.PI * 2);
            // Power function creates a sharp, bright spike when presses hit
            const spike = Math.pow(Math.sin(pulsePhase), 8);
            parts.coreInner.material.emissiveIntensity = 5 + spike * 20;
            
            parts.coreInner.rotation.y = t * 3;
            parts.coreOuter.rotation.x = t * 1.5;
            parts.coreOuter.rotation.z = t * 2.2;
            
            // Plasma shield warp
            const scaleWarp = 1 + Math.sin(t * 15) * 0.05;
            parts.coreOuter.scale.set(scaleWarp, scaleWarp, scaleWarp);
        }
        
        // 2. Gyroscopic Stabilizing Rings
        parts.stabilizingRings.forEach((ring, i) => {
            ring.rotation.x += 0.08 * speed * (i + 1);
            ring.rotation.y += 0.06 * speed * (i + 1.5);
            ring.rotation.z += 0.04 * speed * (i + 0.5);
        });
        
        // 3. Magnetic Confinement Coils
        parts.magCoils.forEach((coil, i) => {
            // Ripple effect running around the torus
            const offset = i * 0.15;
            const ripple = (Math.sin(t * 20 + offset) + 1) / 2;
            coil.material.emissiveIntensity = 1 + ripple * 4;
            
            // Micro-vibrations from extreme power
            coil.position.y = Math.sin(t * 50 + i) * 0.2;
        });
        
        // 4. Gravimetric Press Slamming Sequence
        parts.pressArms.forEach((arm) => {
            const phase = (t * 2) % (Math.PI * 2);
            // Modified sine wave to create a slow pullback and rapid slam
            let motion = Math.sin(phase);
            // Using a signed power function to exaggerate the 'hit'
            motion = Math.sign(motion) * Math.pow(Math.abs(motion), 5);
            
            // Apply angular rotation to the boom pivot
            arm.boomPivot.rotation.x = Math.abs(motion) * 0.45;
            
            // Extend the head forwards during the slam
            arm.headPivot.position.z = 12.5 - Math.abs(motion) * 20;
            
            // Synchronize the hydraulic piston rod
            arm.pistonRod.position.y = 15 + Math.abs(motion) * 12;
        });

        // 5. Crawler Wheels Movement
        parts.wheels.forEach((wheel) => {
            // Wheels continuously driving forward very slowly
            wheel.rotation.z = -t * 1.5; 
        });
        
        // 6. Thermal Radiator Fin Pulsing
        parts.radiatorFins.forEach((fin, i) => {
            // Heat waves washing up the radiator towers
            const heatWave = Math.sin(t * 4 + i * 0.2);
            fin.material.emissiveIntensity = 0.8 + Math.max(0, heatWave) * 1.5;
        });

        // 7. Energy Conduits Pulse
        parts.energyConduits.forEach((conduit, i) => {
            // Rapid energy flow visual
            conduit.material.emissiveIntensity = 2 + Math.sin(t * 30 + i * 2) * 5;
        });

        // 8. Fusion Turbine Spin
        parts.turbines.forEach((turbine, i) => {
            turbine.rotation.z = t * 10 * (i % 2 === 0 ? 1 : -1);
        });

        // 9. Warning Strobe Lights
        parts.warningLights.forEach((light, i) => {
            // Harsh industrial strobe effect
            const strobe = Math.sin(t * 12 + i) > 0.8 ? 8 : 0;
            light.material.emissiveIntensity = strobe;
        });

        // 10. Sensor Dish Sweep
        parts.sensorArrays.forEach(sensor => {
            sensor.rotation.y = Math.sin(t * 2) * Math.PI / 4;
        });

        // 11. Extraction Robotic Arms
        parts.extractionArms.forEach((arm, i) => {
            // Complex jittering and extending motions below the core
            arm.position.y = Math.sin(t * 8 + i) * 2;
            arm.children[0].rotation.z = Math.sin(t * 12 + i) * 0.5; // claws opening/closing
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
