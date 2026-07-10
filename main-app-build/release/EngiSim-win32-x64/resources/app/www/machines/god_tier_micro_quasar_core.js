import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // =========================================================================
    // CUSTOM MATERIALS
    // =========================================================================
    const matSingularity = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const matPlasmaInner = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, emissive: 0x00aaff, emissiveIntensity: 25, 
        transparent: true, opacity: 0.95, side: THREE.DoubleSide 
    });
    const matPlasmaMid = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, emissive: 0xff8c00, emissiveIntensity: 12, 
        transparent: true, opacity: 0.85, side: THREE.DoubleSide 
    });
    const matPlasmaOuter = new THREE.MeshStandardMaterial({ 
        color: 0xff4500, emissive: 0x8b0000, emissiveIntensity: 6, 
        transparent: true, opacity: 0.75, side: THREE.DoubleSide 
    });
    const matJetCore = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xcc00ff, emissiveIntensity: 30, 
        transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const matJetAura = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0x8800ff, emissiveIntensity: 10, 
        transparent: true, opacity: 0.4, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const matMagneticLine = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 8, 
        wireframe: true, transparent: true, opacity: 0.6
    });
    const matNeonGreen = new THREE.MeshStandardMaterial({ 
        color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 5 
    });
    const matGlowingBlue = new THREE.MeshStandardMaterial({ 
        color: 0x0000ff, emissive: 0x00aaff, emissiveIntensity: 6 
    });
    const matSuperconductor = new THREE.MeshStandardMaterial({ 
        color: 0x111111, roughness: 0.1, metalness: 1.0, emissive: 0x001133, emissiveIntensity: 2 
    });
    const matHotMetal = new THREE.MeshStandardMaterial({ 
        color: 0xff5500, emissive: 0xff2200, emissiveIntensity: 3, roughness: 0.3, metalness: 0.8 
    });
    const matShielding = new THREE.MeshStandardMaterial({
        color: 0x111111, transparent: true, opacity: 0.3, side: THREE.DoubleSide, roughness: 0.1, metalness: 0.9
    });
    const matWireframeShield = new THREE.MeshStandardMaterial({
        color: 0x555555, wireframe: true, transparent: true, opacity: 0.5
    });

    // =========================================================================
    // PART BUILDER FUNCTIONS
    // =========================================================================

    // 1. EVENT HORIZON SINGULARITY
    function buildEventHorizon() {
        const geo = new THREE.SphereGeometry(10, 64, 64);
        const mesh = new THREE.Mesh(geo, matSingularity);
        group.add(mesh);
        return mesh;
    }

    // 2. ISCO PLASMA RING
    function buildISCO() {
        const iscoGroup = new THREE.Group();
        // The Innermost Stable Circular Orbit
        const geo = new THREE.TorusGeometry(18, 3, 64, 128);
        const ring = new THREE.Mesh(geo, matPlasmaInner);
        ring.rotation.x = Math.PI / 2;
        iscoGroup.add(ring);
        
        // Add extreme energy particles
        for(let i=0; i<100; i++) {
            const pGeo = new THREE.SphereGeometry(0.5, 8, 8);
            const pMesh = new THREE.Mesh(pGeo, matJetCore);
            const angle = (i/100) * Math.PI * 2;
            const r = 18 + (Math.random() * 4 - 2);
            pMesh.position.set(Math.cos(angle)*r, (Math.random()*4-2), Math.sin(angle)*r);
            iscoGroup.add(pMesh);
        }
        
        group.add(iscoGroup);
        updatables.push({ mesh: iscoGroup, type: 'spin', speed: 0.1 });
        updatables.push({ mesh: iscoGroup, type: 'pulse', baseScale: 1.0, amplitude: 0.02, frequency: 15 });
        return iscoGroup;
    }

    // 3. MAIN ACCRETION DISK
    function buildAccretionDisk() {
        const diskGroup = new THREE.Group();
        const geo = new THREE.TorusGeometry(35, 8, 64, 200);
        const disk = new THREE.Mesh(geo, matPlasmaMid);
        disk.rotation.x = Math.PI / 2;
        disk.scale.z = 0.2; // Flatten it out
        diskGroup.add(disk);

        // Clumpy density waves
        for(let i=0; i<8; i++) {
            const waveGeo = new THREE.TorusGeometry(35, 9, 32, 64, Math.PI / 2);
            const wave = new THREE.Mesh(waveGeo, matPlasmaInner);
            wave.rotation.x = Math.PI / 2;
            wave.rotation.z = (i/8) * Math.PI * 2;
            wave.scale.z = 0.15;
            diskGroup.add(wave);
        }

        group.add(diskGroup);
        updatables.push({ mesh: diskGroup, type: 'spin', speed: 0.05 });
        return diskGroup;
    }

    // 4. OUTER TORUS MATTER RESERVOIR
    function buildOuterTorus() {
        const torusGroup = new THREE.Group();
        const geo = new THREE.TorusGeometry(60, 12, 64, 128);
        const torus = new THREE.Mesh(geo, matPlasmaOuter);
        torus.rotation.x = Math.PI / 2;
        torus.scale.z = 0.5;
        torusGroup.add(torus);
        
        group.add(torusGroup);
        updatables.push({ mesh: torusGroup, type: 'spin', speed: 0.02 });
        return torusGroup;
    }

    // 5. RELATIVISTIC JET ALPHA (TOP)
    function buildJetAlpha() {
        const jetGroup = new THREE.Group();
        
        // Inner core
        const coreGeo = new THREE.CylinderGeometry(2, 8, 300, 32, 64, true);
        const core = new THREE.Mesh(coreGeo, matJetCore);
        core.position.y = 150;
        
        // Outer aura
        const auraGeo = new THREE.CylinderGeometry(5, 15, 300, 32, 64, true);
        const aura = new THREE.Mesh(auraGeo, matJetAura);
        aura.position.y = 150;

        jetGroup.add(core);
        jetGroup.add(aura);
        
        group.add(jetGroup);
        updatables.push({ mesh: jetGroup, type: 'jet', polarity: 1 });
        return jetGroup;
    }

    // 6. RELATIVISTIC JET BETA (BOTTOM)
    function buildJetBeta() {
        const jetGroup = new THREE.Group();
        
        const coreGeo = new THREE.CylinderGeometry(2, 8, 300, 32, 64, true);
        const core = new THREE.Mesh(coreGeo, matJetCore);
        core.position.y = -150;
        core.rotation.x = Math.PI;
        
        const auraGeo = new THREE.CylinderGeometry(5, 15, 300, 32, 64, true);
        const aura = new THREE.Mesh(auraGeo, matJetAura);
        aura.position.y = -150;
        aura.rotation.x = Math.PI;

        jetGroup.add(core);
        jetGroup.add(aura);
        
        group.add(jetGroup);
        updatables.push({ mesh: jetGroup, type: 'jet', polarity: -1 });
        return jetGroup;
    }

    // 7. MAGNETIC HELICAL CONFINEMENT
    function buildMagneticHelices() {
        const helixGroup = new THREE.Group();
        
        class CustomSinCurve extends THREE.Curve {
            constructor(scale, turns, height) {
                super();
                this.scale = scale;
                this.turns = turns;
                this.height = height;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const ty = t * this.height;
                const angle = t * Math.PI * 2 * this.turns;
                const radius = this.scale * (1.2 - t); 
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                return optionalTarget.set(x, ty, z);
            }
        }
        
        // Top helices
        for(let i=0; i<4; i++) {
            const offset = (i/4)*Math.PI*2;
            const path = new CustomSinCurve(20, 15, 280);
            const tubeGeo = new THREE.TubeGeometry(path, 300, 0.8, 8, false);
            const tube = new THREE.Mesh(tubeGeo, matMagneticLine);
            tube.position.y = 10;
            tube.rotation.y = offset;
            helixGroup.add(tube);
            updatables.push({ mesh: tube, type: 'spin', speed: 0.15 });
        }

        // Bottom helices
        for(let i=0; i<4; i++) {
            const offset = (i/4)*Math.PI*2;
            const path = new CustomSinCurve(20, -15, 280);
            const tubeGeo = new THREE.TubeGeometry(path, 300, 0.8, 8, false);
            const tube = new THREE.Mesh(tubeGeo, matMagneticLine);
            tube.rotation.x = Math.PI; // point down
            tube.position.y = -10;
            tube.rotation.y = offset;
            helixGroup.add(tube);
            updatables.push({ mesh: tube, type: 'spin', speed: 0.15 });
        }

        group.add(helixGroup);
        return helixGroup;
    }

    // 8. SUPERCONDUCTING TOROIDAL FIELD COILS
    function buildToroidalCoils() {
        const coilsGroup = new THREE.Group();
        const numCoils = 24;
        for (let i = 0; i < numCoils; i++) {
            const angle = (i / numCoils) * Math.PI * 2;
            const coilMaster = new THREE.Group();
            
            // The main ring
            const ringGeo = new THREE.TorusGeometry(35, 4, 16, 50);
            const ring = new THREE.Mesh(ringGeo, matSuperconductor);
            ring.rotation.y = Math.PI / 2;
            
            // Outer casing bands
            for(let j=0; j<8; j++) {
                const bandGeo = new THREE.CylinderGeometry(39.5, 39.5, 2, 32, 1, true);
                const band = new THREE.Mesh(bandGeo, steel);
                band.rotation.z = Math.PI / 2;
                band.rotation.x = (j/8) * Math.PI * 2;
                coilMaster.add(band);
            }

            // Hydraulic mount
            const mountGeo = new THREE.BoxGeometry(6, 6, 20);
            const mount = new THREE.Mesh(mountGeo, darkSteel);
            mount.position.set(0, 0, -40);
            
            coilMaster.add(ring);
            coilMaster.add(mount);

            coilMaster.position.x = Math.cos(angle) * 70;
            coilMaster.position.z = Math.sin(angle) * 70;
            coilMaster.lookAt(0, 0, 0);

            coilsGroup.add(coilMaster);
            updatables.push({ mesh: coilMaster, type: 'breathe', offset: i, amplitude: 2 });
        }
        group.add(coilsGroup);
        return coilsGroup;
    }

    // 9. POLOIDAL FIELD GENERATOR RINGS
    function buildPoloidalRings() {
        const ringsGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(90, 3, 32, 100);
        
        const topRing = new THREE.Mesh(ringGeo, copper);
        topRing.rotation.x = Math.PI / 2;
        topRing.position.y = 40;
        ringsGroup.add(topRing);

        const bottomRing = new THREE.Mesh(ringGeo, copper);
        bottomRing.rotation.x = Math.PI / 2;
        bottomRing.position.y = -40;
        ringsGroup.add(bottomRing);

        group.add(ringsGroup);
        updatables.push({ mesh: topRing, type: 'pulse', baseScale: 1.0, amplitude: 0.01, frequency: 5 });
        updatables.push({ mesh: bottomRing, type: 'pulse', baseScale: 1.0, amplitude: 0.01, frequency: 5 });
        return ringsGroup;
    }

    // 10. PLASMA INJECTION CONDUITS
    function buildPlasmaInjectors() {
        const injGroup = new THREE.Group();
        const points = [];
        // Lathe profile for complex nozzle
        for (let i = 0; i < 30; i++) {
            const x = 5 + Math.sin(i * 0.3) * 2 + (i * 0.1);
            const y = (i - 15) * 2;
            points.push(new THREE.Vector2(x, y));
        }
        const latheGeo = new THREE.LatheGeometry(points, 32);
        
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const injector = new THREE.Group();
            
            const nozzle = new THREE.Mesh(latheGeo, chrome);
            nozzle.rotation.x = Math.PI / 2;
            injector.add(nozzle);

            // Glowing plasma feed inside
            const feedGeo = new THREE.CylinderGeometry(2, 2, 60, 16);
            const feed = new THREE.Mesh(feedGeo, matPlasmaOuter);
            feed.rotation.x = Math.PI / 2;
            feed.position.z = 10;
            injector.add(feed);

            injector.position.set(Math.cos(angle) * 110, 0, Math.sin(angle) * 110);
            injector.lookAt(0, 0, 0);
            
            injGroup.add(injector);
            updatables.push({ mesh: feed, type: 'flow', speed: 20 });
        }
        
        group.add(injGroup);
        return injGroup;
    }

    // 11. CRYOGENIC COOLING MANIFOLDS
    function buildCoolingManifolds() {
        const manifoldGroup = new THREE.Group();
        
        // Define a complex sweeping curve
        class CoolingCurve extends THREE.Curve {
            constructor(radius, loops, height) {
                super();
                this.radius = radius;
                this.loops = loops;
                this.height = height;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const angle = t * Math.PI * 2 * this.loops;
                const x = Math.cos(angle) * this.radius;
                const z = Math.sin(angle) * this.radius;
                const y = Math.sin(t * Math.PI * 4) * this.height;
                return optionalTarget.set(x, y, z);
            }
        }
        
        const path = new CoolingCurve(95, 6, 20);
        const pipeGeo = new THREE.TubeGeometry(path, 300, 1.5, 16, true);
        const pipeMesh = new THREE.Mesh(pipeGeo, glass); // glass to see coolant
        
        const coolantGeo = new THREE.TubeGeometry(path, 300, 1.0, 16, true);
        const coolantMesh = new THREE.Mesh(coolantGeo, matGlowingBlue);

        manifoldGroup.add(pipeMesh);
        manifoldGroup.add(coolantMesh);

        // Fins along the manifold
        for (let i = 0; i < 150; i++) {
            const t = i / 150;
            const pt = path.getPoint(t);
            const tangent = path.getTangent(t);
            const finGeo = new THREE.TorusGeometry(3, 0.5, 8, 16);
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.copy(pt);
            fin.lookAt(pt.clone().add(tangent));
            manifoldGroup.add(fin);
        }
        
        group.add(manifoldGroup);
        updatables.push({ mesh: coolantMesh, type: 'pulse', baseScale: 1.0, amplitude: 0.1, frequency: 10 });
        return manifoldGroup;
    }

    // 12. X-RAY SHIELDING ICOSAHEDRON
    function buildXRayShield() {
        const shieldGroup = new THREE.Group();
        const icoGeo = new THREE.IcosahedronGeometry(130, 3);
        
        const shieldSolid = new THREE.Mesh(icoGeo, matShielding);
        const shieldWire = new THREE.Mesh(icoGeo, matWireframeShield);
        
        shieldGroup.add(shieldSolid);
        shieldGroup.add(shieldWire);
        group.add(shieldGroup);
        
        updatables.push({ mesh: shieldGroup, type: 'spin', speed: 0.005 });
        return shieldGroup;
    }

    // 13. ERGOSPHERE ENERGY EXTRACTORS
    function buildErgosphereExtractors() {
        const extractorGroup = new THREE.Group();
        const numExtractors = 12;
        for (let i = 0; i < numExtractors; i++) {
            const angle = (i / numExtractors) * Math.PI * 2;
            const exGeo = new THREE.ConeGeometry(5, 40, 16);
            const extractor = new THREE.Mesh(exGeo, steel);
            
            // Move tip right near the ISCO
            extractor.position.set(Math.cos(angle) * 35, 0, Math.sin(angle) * 35);
            extractor.lookAt(0, 0, 0);
            extractor.rotation.x -= Math.PI / 2; // point cone tip inwards
            
            extractorGroup.add(extractor);
            updatables.push({ mesh: extractor, type: 'piston', offset: i, axis: 'z', range: 5, speed: 2 });
        }
        group.add(extractorGroup);
        return extractorGroup;
    }

    // 14. FRAME-DRAGGING SENSOR ARRAY
    function buildFrameDraggingSensors() {
        const sensorGroup = new THREE.Group();
        for(let i = 0; i < 36; i++) {
            const angle = (i/36) * Math.PI * 2;
            const sGeo = new THREE.BoxGeometry(1, 4, 1);
            const sensor = new THREE.Mesh(sGeo, matNeonGreen);
            sensor.position.set(Math.cos(angle)*50, 5, Math.sin(angle)*50);
            sensor.lookAt(0, 5, 0);
            sensorGroup.add(sensor);
        }
        group.add(sensorGroup);
        updatables.push({ mesh: sensorGroup, type: 'spin', speed: 0.08 }); // Fast orbit to measure frame dragging
        return sensorGroup;
    }

    // 15. QUANTUM STABILIZER PISTONS
    function buildQuantumPistons() {
        const pistonGroup = new THREE.Group();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pGroup = new THREE.Group();
            
            const cylinderGeo = new THREE.CylinderGeometry(4, 4, 30, 16);
            const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
            pGroup.add(cylinder);

            const rodGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const rod = new THREE.Mesh(rodGeo, chrome);
            pGroup.add(rod);

            pGroup.position.set(Math.cos(angle) * 140, 60, Math.sin(angle) * 140);
            pGroup.lookAt(0, 0, 0);
            pGroup.rotation.x = Math.PI / 4;

            pistonGroup.add(pGroup);
            updatables.push({ mesh: rod, type: 'piston_linear', offset: i, range: 15, speed: 5 });
        }
        group.add(pistonGroup);
        return pistonGroup;
    }

    // 16. GRAVITATIONAL WAVE DAMPERS
    function buildWaveDampers() {
        const damperGroup = new THREE.Group();
        const dGeo = new THREE.BoxGeometry(20, 20, 20);
        for(let i=0; i<8; i++) {
            const damper = new THREE.Mesh(dGeo, rubber);
            const angle = (i/8) * Math.PI * 2;
            damper.position.set(Math.cos(angle)*160, -80, Math.sin(angle)*160);
            damper.lookAt(0, -80, 0);
            damperGroup.add(damper);
            updatables.push({ mesh: damper, type: 'shake', intensity: 0.5 });
        }
        group.add(damperGroup);
        return damperGroup;
    }

    // 17. DARK MATTER CONTAINMENT SHELL
    function buildContainmentShell() {
        const shellGroup = new THREE.Group();
        const geo = new THREE.SphereGeometry(180, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.8);
        const shell = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
            color: 0x222222, metalness: 0.6, roughness: 0.8, side: THREE.DoubleSide
        }));
        shell.rotation.x = Math.PI; // open at top
        shellGroup.add(shell);
        
        group.add(shellGroup);
        return shellGroup;
    }

    // 18. OPERATOR COMMAND CABIN
    function buildOperatorCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main hull
        const hullGeo = new THREE.CylinderGeometry(15, 15, 30, 8);
        const hull = new THREE.Mesh(hullGeo, steel);
        hull.rotation.z = Math.PI / 2;
        cabinGroup.add(hull);

        // Tinted Viewport Window
        const windowGeo = new THREE.CylinderGeometry(14, 14, 20, 8, 1, false, 0, Math.PI);
        const cabinWindow = new THREE.Mesh(windowGeo, tinted);
        cabinWindow.rotation.z = Math.PI / 2;
        cabinWindow.position.y = 1.5;
        cabinGroup.add(cabinWindow);

        // Screens and consoles inside
        const screenGeo = new THREE.BoxGeometry(8, 4, 0.5);
        const screen1 = new THREE.Mesh(screenGeo, matNeonGreen);
        screen1.position.set(8, -2, -8);
        screen1.rotation.y = -Math.PI / 4;
        cabinGroup.add(screen1);

        const screen2 = new THREE.Mesh(screenGeo, matGlowingBlue);
        screen2.position.set(-8, -2, -8);
        screen2.rotation.y = Math.PI / 4;
        cabinGroup.add(screen2);

        // Command Seat
        const seatGeo = new THREE.BoxGeometry(4, 5, 4);
        const seat = new THREE.Mesh(seatGeo, rubber);
        seat.position.set(0, -6, -2);
        cabinGroup.add(seat);

        // Main Console
        const consoleGeo = new THREE.BoxGeometry(16, 2, 6);
        const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
        consoleMesh.position.set(0, -4, -10);
        cabinGroup.add(consoleMesh);

        // Cabin support arm
        const armGeo = new THREE.BoxGeometry(60, 4, 4);
        const arm = new THREE.Mesh(armGeo, steel);
        arm.position.set(-30, 0, 0);
        cabinGroup.add(arm);

        cabinGroup.position.set(220, 0, 0);
        
        group.add(cabinGroup);
        return cabinGroup;
    }

    // 19. HYDRAULIC SUPPORT STRUTS
    function buildHydraulicSupportStruts() {
        const supportGroup = new THREE.Group();
        
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(15, 0);
        shape.lineTo(20, 5);
        shape.lineTo(20, 10);
        shape.lineTo(5, 20);
        shape.lineTo(0, 20);
        shape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
        const extGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const strut = new THREE.Mesh(extGeo, darkSteel);
            strut.position.set(Math.cos(angle) * 170, -100, Math.sin(angle) * 170);
            strut.lookAt(0, -100, 0);
            supportGroup.add(strut);
        }
        
        group.add(supportGroup);
        return supportGroup;
    }

    // 20. DATA TRANSMISSION ARRAY
    function buildDataTransmissionArray() {
        const arrayGroup = new THREE.Group();
        
        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2;
            const dishGeo = new THREE.SphereGeometry(15, 16, 16, 0, Math.PI);
            const dish = new THREE.Mesh(dishGeo, aluminum);
            
            const antennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 20);
            const antenna = new THREE.Mesh(antennaGeo, matGlowingBlue);
            antenna.position.z = 10;
            antenna.rotation.x = Math.PI / 2;
            
            dish.add(antenna);
            
            dish.position.set(Math.cos(angle)*190, 80, Math.sin(angle)*190);
            dish.lookAt(0, 200, 0); // pointing outwards/upwards
            
            arrayGroup.add(dish);
            updatables.push({ mesh: dish, type: 'wobble', speed: 1, intensity: 0.05 });
        }
        
        group.add(arrayGroup);
        return arrayGroup;
    }

    // =========================================================================
    // INITIALIZATION OF PARTS
    // =========================================================================
    buildEventHorizon();
    buildISCO();
    buildAccretionDisk();
    buildOuterTorus();
    buildJetAlpha();
    buildJetBeta();
    buildMagneticHelices();
    buildToroidalCoils();
    buildPoloidalRings();
    buildPlasmaInjectors();
    buildCoolingManifolds();
    buildXRayShield();
    buildErgosphereExtractors();
    buildFrameDraggingSensors();
    buildQuantumPistons();
    buildWaveDampers();
    buildContainmentShell();
    buildOperatorCabin();
    buildHydraulicSupportStruts();
    buildDataTransmissionArray();


    // =========================================================================
    // PARTS METADATA EXPORT
    // =========================================================================
    parts.push(
        {
            name: "Event Horizon Singularity",
            description: "The infinitely dense core and absolute boundary of no return. Implements a Kerr metric spacetime curvature with extreme time dilation and frame dragging. Nothing escapes this void.",
            material: "Gravitational Void",
            function: "Primary mass and energy source, driving the entire quasar ecosystem.",
            assemblyOrder: 1,
            connections: ["ISCO Plasma Ring", "Ergosphere Energy Extractors"],
            failureEffect: "Uncontrollable evaporation via Hawking radiation or runaway accretion resulting in macro-scale spacetime tearing.",
            cascadeFailures: ["Total system annihilation", "Local galactic sector destabilization"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 500, z: 0 }
        },
        {
            name: "ISCO Plasma Ring",
            description: "The Innermost Stable Circular Orbit. The exact radius where plasma can orbit stably before inevitably spiraling into the event horizon.",
            material: "Super-heated Ultra-Plasma",
            function: "Final acceleration zone for matter before assimilation, generating immense frictional heat and X-rays.",
            assemblyOrder: 2,
            connections: ["Main Accretion Disk", "Event Horizon Singularity"],
            failureEffect: "Sudden plunge of massive plasma volumes, resulting in a devastating gamma-ray burst.",
            cascadeFailures: ["X-Ray Shielding overload", "Sensory array destruction"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 400, z: 0 }
        },
        {
            name: "Main Accretion Disk",
            description: "A swirling disk of insanely hot, highly ionized plasma. Subject to Magneto-Rotational Instabilities (MRI) causing massive density waves.",
            material: "Ionized Gold/Orange Plasma",
            function: "Transports angular momentum outwards while allowing mass to accrete inwards.",
            assemblyOrder: 3,
            connections: ["ISCO Plasma Ring", "Outer Torus Matter Reservoir", "Plasma Injection Conduits"],
            failureEffect: "Accretion stall, causing the black hole to starve and the magnetic fields to collapse.",
            cascadeFailures: ["Jet dissipation", "Field coil overload"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 300, z: 0 }
        },
        {
            name: "Outer Torus Matter Reservoir",
            description: "A thick, cooler torus of gas and dust circling the accretion disk, acting as the primary fuel buffer.",
            material: "Dense Red Plasma",
            function: "Stores injected matter and feeds it steadily into the main accretion disk.",
            assemblyOrder: 4,
            connections: ["Main Accretion Disk", "Plasma Injection Conduits"],
            failureEffect: "Fuel starvation or sudden inundation of the inner disk.",
            cascadeFailures: ["Thermal runaway", "Accretion Disk destabilization"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 200, z: 0 }
        },
        {
            name: "Relativistic Jet Alpha (Top)",
            description: "A blindingly bright, highly collimated beam of ionized matter traveling at fractions of the speed of light.",
            material: "Hyper-energetic Purple/White Plasma",
            function: "Expels excessive angular momentum and magnetic energy from the poles via the Blandford-Znajek process.",
            assemblyOrder: 5,
            connections: ["Event Horizon Singularity", "Magnetic Helical Confinement"],
            failureEffect: "Backblast of relativistic particles into the containment shell.",
            cascadeFailures: ["Shell vaporization", "Operator Cabin destruction"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 800, z: 0 }
        },
        {
            name: "Relativistic Jet Beta (Bottom)",
            description: "The southern counterpart to Jet Alpha, ensuring conservation of momentum across the black hole's rotational axis.",
            material: "Hyper-energetic Purple/White Plasma",
            function: "Maintains rotational symmetry and axial stability of the Kerr black hole.",
            assemblyOrder: 6,
            connections: ["Event Horizon Singularity", "Magnetic Helical Confinement"],
            failureEffect: "Axial tilt, causing the quasar to tear itself out of the containment structure.",
            cascadeFailures: ["Gravitational wave surge", "Total structural collapse"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -800, z: 0 }
        },
        {
            name: "Magnetic Helical Confinement",
            description: "Intense, twisting magnetic field lines tightly winding around the relativistic jets.",
            material: "Visible Cyan Magnetic Flux",
            function: "Collimates the jets, preventing them from blowing out laterally and destroying the facility.",
            assemblyOrder: 7,
            connections: ["Relativistic Jets", "Poloidal Field Generator Rings"],
            failureEffect: "Jet decollimation.",
            cascadeFailures: ["Instant vaporization of the entire surrounding planetary system"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 600, z: 200 }
        },
        {
            name: "Superconducting Toroidal Field Coils",
            description: "24 massive, cryogenically cooled rings carrying peta-amps of current to generate the primary containment field.",
            material: "Superconducting Alloy & Copper",
            function: "Confines the outer edges of the accretion disk and shapes the global magnetic topology.",
            assemblyOrder: 8,
            connections: ["Main Accretion Disk", "Cryogenic Cooling Manifolds"],
            failureEffect: "Quench event. Magnetic field collapses, releasing peta-joules of energy instantly.",
            cascadeFailures: ["Explosive thermal expansion", "Plasma breach"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 200, y: 0, z: 200 }
        },
        {
            name: "Poloidal Field Generator Rings",
            description: "Giant horizontal copper rings establishing the vertical magnetic fields necessary for jet formation.",
            material: "High-Purity Copper",
            function: "Drives the dynamo effect within the accretion disk.",
            assemblyOrder: 9,
            connections: ["Magnetic Helical Confinement", "Toroidal Coils"],
            failureEffect: "Loss of vertical magnetic tension, stalling the jets.",
            cascadeFailures: ["Accretion disk over-pressurization"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 300 }
        },
        {
            name: "Plasma Injection Conduits",
            description: "8 massive nozzles that inject raw star-matter into the outer torus.",
            material: "Chrome and Plasma",
            function: "Feeds the black hole to sustain the energy generation process.",
            assemblyOrder: 10,
            connections: ["Outer Torus Matter Reservoir", "Dark Matter Containment Shell"],
            failureEffect: "Blockage leading to backflow of plasma.",
            cascadeFailures: ["Conduit explosion", "Fuel supply detonation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 300, y: 0, z: 0 }
        },
        {
            name: "Cryogenic Cooling Manifolds",
            description: "A labyrinth of glass and aluminum pipes carrying liquid helium-3 near absolute zero.",
            material: "Glass, Aluminum, Glowing Blue Coolant",
            function: "Prevents the superconducting coils and local machinery from melting due to the intense proximity heat.",
            assemblyOrder: 11,
            connections: ["Superconducting Toroidal Field Coils", "Hydraulic Support Struts"],
            failureEffect: "Coolant boil-off.",
            cascadeFailures: ["Coil quench", "System-wide meltdown"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -200, y: 100, z: -200 }
        },
        {
            name: "X-Ray Shielding Icosahedron",
            description: "A colossal, semi-transparent geodesic sphere composed of high-Z materials.",
            material: "Carbon-Tungsten Lattice",
            function: "Absorbs hard X-rays and gamma rays emitted from the ISCO.",
            assemblyOrder: 12,
            connections: ["Containment Shell", "Operator Command Cabin"],
            failureEffect: "Lethal radiation leakage.",
            cascadeFailures: ["Operator death", "Sensor array frying"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 400 }
        },
        {
            name: "Ergosphere Energy Extractors",
            description: "Highly advanced physical probes designed to dip directly into the ergosphere of the black hole.",
            material: "Neutron Star Core Material",
            function: "Extracts rotational kinetic energy via the Penrose process by splitting particles inside the ergosphere.",
            assemblyOrder: 13,
            connections: ["Event Horizon Singularity", "Data Transmission Array"],
            failureEffect: "Probe gets dragged completely into the black hole.",
            cascadeFailures: ["Loss of extraction efficiency", "Structural tension snap"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -100, y: -100, z: -100 }
        },
        {
            name: "Frame-Dragging Sensor Array",
            description: "High-speed orbital modules tracking the gravitomagnetic Lense-Thirring effect.",
            material: "Neon Green Sensor Housings",
            function: "Provides real-time metric telemetry to calibrate the magnetic coils.",
            assemblyOrder: 14,
            connections: ["X-Ray Shielding Icosahedron"],
            failureEffect: "Loss of telemetry.",
            cascadeFailures: ["Magnetic misalignment", "Jet decollimation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 150, y: 150, z: -150 }
        },
        {
            name: "Quantum State Stabilizer Pistons",
            description: "Massive pneumatic cylinders applying exact counter-forces to spacetime warping.",
            material: "Dark Steel and Chrome",
            function: "Prevents localized geometry tearing due to extreme mass density gradients.",
            assemblyOrder: 15,
            connections: ["Hydraulic Support Struts", "Dark Matter Containment Shell"],
            failureEffect: "Piston rupture.",
            cascadeFailures: ["Macroscopic quantum decoherence in the containment shell"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -250, y: 200, z: 0 }
        },
        {
            name: "Gravitational Wave Dampers",
            description: "Huge blocks of exotic rubber-like meta-materials anchored to the frame.",
            material: "Exotic Rubber",
            function: "Absorbs ripples in spacetime caused by plasma plunging events.",
            assemblyOrder: 16,
            connections: ["Dark Matter Containment Shell", "Hydraulic Support Struts"],
            failureEffect: "Harmonic resonance buildup.",
            cascadeFailures: ["Shattering of the X-Ray Shield", "Containment breach"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -300, z: -200 }
        },
        {
            name: "Dark Matter Containment Shell",
            description: "The primary outer spherical hull of the engine room.",
            material: "Dark Matter laced alloy",
            function: "Provides the ultimate physical boundary between the quasar and the outside universe.",
            assemblyOrder: 17,
            connections: ["Hydraulic Support Struts", "Operator Command Cabin"],
            failureEffect: "Hull breach.",
            cascadeFailures: ["Total atmospheric venting", "Absolute destruction"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -600 }
        },
        {
            name: "Operator Command Cabin",
            description: "A heavily shielded, multi-screened control room suspended on a massive steel arm.",
            material: "Steel, Tinted Glass, Rubber",
            function: "Houses the chief astrophysics engineers monitoring the micro-quasar.",
            assemblyOrder: 18,
            connections: ["Dark Matter Containment Shell"],
            failureEffect: "Life support failure.",
            cascadeFailures: ["Operators perish, resulting in unmanaged AI takeover."],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 400, y: 0, z: 0 }
        },
        {
            name: "Hydraulic Support Struts",
            description: "Extruded dark steel pillars holding the entire massive assembly together.",
            material: "Dark Steel",
            function: "Transfers mechanical loads across the facility.",
            assemblyOrder: 19,
            connections: ["Containment Shell", "Toroidal Coils"],
            failureEffect: "Strut buckling.",
            cascadeFailures: ["Asymmetric gravitational loads", "Facility collapse"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -400, y: -400, z: 400 }
        },
        {
            name: "Data Transmission Array",
            description: "Massive dish antennas with glowing blue transmitter cores.",
            material: "Aluminum and Glowing Blue Plasma",
            function: "Beams extracted power and telemetry to remote planetary grids.",
            assemblyOrder: 20,
            connections: ["Containment Shell", "Ergosphere Energy Extractors"],
            failureEffect: "Grid disconnect.",
            cascadeFailures: ["Power backup inside the quasar, leading to catastrophic thermal overload."],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 500, z: 500 }
        }
    );

    // =========================================================================
    // PhD LEVEL QUIZ QUESTIONS
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of the Blandford-Znajek process utilized by this Micro Quasar Core, what is the primary source of the energy extracted to power the relativistic jets?",
            options: [
                "The rest-mass energy of the infalling plasma.",
                "The thermal radiation of the accretion disk.",
                "The rotational kinetic energy of the Kerr black hole itself.",
                "The Hawking radiation emitted at the event horizon."
            ],
            correctAnswer: 2,
            explanation: "The Blandford-Znajek process extracts energy directly from the spin of a rotating (Kerr) black hole using strong, twisting magnetic fields that thread the event horizon."
        },
        {
            question: "At what critical radius does the accretion disk in this model abruptly terminate before plunging into the event horizon, assuming a non-rotating Schwarzschild spacetime for simplicity?",
            options: [
                "2 GM/c^2",
                "3 GM/c^2",
                "6 GM/c^2",
                "1.5 GM/c^2"
            ],
            correctAnswer: 2,
            explanation: "The Innermost Stable Circular Orbit (ISCO) for a non-rotating black hole is located at 6 GM/c^2 (or 3 Schwarzschild radii). Inside this radius, no stable circular orbits exist, and matter spirals rapidly into the horizon."
        },
        {
            question: "The swirling plasma in the mid-disk regions is highly susceptible to the Magneto-Rotational Instability (MRI). What essential role does MRI play in the accretion process?",
            options: [
                "It generates the extreme temperatures required for X-ray emission.",
                "It provides the necessary anomalous viscosity to transport angular momentum outward, allowing mass to accrete inward.",
                "It prevents the relativistic jets from decollimating.",
                "It shields the outer torus from the intense gamma radiation."
            ],
            correctAnswer: 1,
            explanation: "Molecular viscosity is far too weak to account for observed accretion rates. MRI creates turbulence that effectively acts as enhanced viscosity, transferring angular momentum outward so matter can fall inward."
        },
        {
            question: "The inner edge of the accretion disk experiences extreme frame-dragging. What is the name of the precession effect caused by this gravitomagnetic field on the orbits of the plasma particles?",
            options: [
                "Thomas Precession",
                "Larmor Precession",
                "Lense-Thirring Precession",
                "Geodetic Precession"
            ],
            correctAnswer: 2,
            explanation: "Lense-Thirring precession is a relativistic effect in which the rotating mass of the black hole drags the surrounding spacetime fabric, causing the orbits of particles to precess."
        },
        {
            question: "If an automated physical probe enters the ergosphere of this micro-quasar and splits in two, with one part falling into the black hole with negative energy and the other escaping to infinity with more energy than the original probe, what specific mechanism is being demonstrated?",
            options: [
                "The Blandford-Znajek Process",
                "The Penrose Process",
                "Superradiant Scattering",
                "Hawking Radiation"
            ],
            correctAnswer: 1,
            explanation: "The Penrose process allows energy to be extracted from a rotating black hole's ergosphere by breaking an object into two pieces; if one piece enters a negative energy trajectory and falls in, the other piece must escape with greater energy than the original object."
        }
    ];

    // =========================================================================
    // ADVANCED ANIMATION LOOP
    // =========================================================================
    function animate(time, speed) {
        // time is usually provided in milliseconds, let's scale it
        const t = time * 0.001 * speed;
        
        updatables.forEach(item => {
            if (item.type === 'spin') {
                item.mesh.rotation.y += item.speed * speed;
            } 
            else if (item.type === 'pulse') {
                const scale = item.baseScale + Math.sin(t * item.frequency) * item.amplitude;
                item.mesh.scale.set(scale, scale, scale);
            }
            else if (item.type === 'jet') {
                // Jets pulsate and stretch slightly
                item.mesh.scale.y = 1 + Math.sin(t * 8) * 0.05;
                // Additive intensity wobble
                item.mesh.children.forEach(child => {
                    if (child.material && child.material.emissiveIntensity) {
                        child.material.emissiveIntensity = 20 + Math.sin(t * 15) * 10;
                    }
                });
            }
            else if (item.type === 'breathe') {
                // Toroidal coils breathing effect
                const s = 1 + Math.sin(t * 2 + item.offset) * 0.02;
                item.mesh.scale.set(s, s, s);
            }
            else if (item.type === 'flow') {
                // Plasma feeds flowing
                item.mesh.position.z = 10 + (t * item.speed) % 10; 
                // Using modulo to simulate continuous flow of glowing segments
            }
            else if (item.type === 'piston') {
                // Ergosphere extractors dipping in and out
                item.mesh.position[item.axis] = Math.cos(t * item.speed + item.offset) * item.range;
            }
            else if (item.type === 'piston_linear') {
                // Quantum stabilizers thrusting
                item.mesh.position.y = Math.sin(t * item.speed + item.offset) * item.range;
            }
            else if (item.type === 'shake') {
                // Gravitational wave dampers vibrating rapidly
                item.mesh.position.x += (Math.random() - 0.5) * item.intensity;
                item.mesh.position.y += (Math.random() - 0.5) * item.intensity;
                item.mesh.position.z += (Math.random() - 0.5) * item.intensity;
                // slowly return to base to prevent drifting
                item.mesh.position.lerp(new THREE.Vector3(
                    item.mesh.userData.baseX || item.mesh.position.x,
                    item.mesh.userData.baseY || item.mesh.position.y,
                    item.mesh.userData.baseZ || item.mesh.position.z
                ), 0.1);
                
                if(!item.mesh.userData.baseX) {
                    item.mesh.userData.baseX = item.mesh.position.x;
                    item.mesh.userData.baseY = item.mesh.position.y;
                    item.mesh.userData.baseZ = item.mesh.position.z;
                }
            }
            else if (item.type === 'wobble') {
                // Antennas tracking targets
                item.mesh.rotation.x = Math.sin(t * item.speed) * item.intensity;
                item.mesh.rotation.z = Math.cos(t * item.speed * 0.8) * item.intensity;
            }
        });
    }

    return {
        group,
        parts,
        description: "An Ultra God Tier Micro-Quasar Core. Contains a stellar-mass Kerr black hole, feeding off a massive highly-ionized accretion disk. Utilizing the Penrose process and Blandford-Znajek mechanism, it extracts rotational energy directly from spacetime, collimating it into devastating relativistic jets confined by extreme superconducting magnetic topologies. Beware of hard X-rays and gravitational shearing.",
        quizQuestions,
        animate
    };
}
