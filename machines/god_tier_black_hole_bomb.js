import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ============================================================================
    // MEGASTRUCTURE: KERR BLACK HOLE BOMB (SUPERRADIANT SCATTERING)
    // ============================================================================
    const description = "GOD TIER: Kerr Black Hole Bomb (Superradiant Scattering Megastructure). This monstrous construct entirely encloses a rapidly rotating oblate black hole. By firing specific frequencies of electromagnetic waves into the ergosphere, the waves steal rotational energy via frame-dragging (the Penrose process for waves). The immense spherical mirror shell traps the amplified waves, creating an exponential runaway effect. Unimaginable energy is extracted via massive towering capacitors. Extreme care must be taken to bleed the energy before radiation pressure completely vaporizes the structural integrity of the mirror shell.";

    // --- CUSTOM HIGH-TECH MATERIALS ---
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 8, transparent: true, opacity: 0.9, roughness: 0.1, metalness: 0.8 });
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 15, transparent: true, opacity: 0.8 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0022, emissive: 0xff0022, emissiveIntensity: 10, roughness: 0.1 });
    const voidBlack = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff3300, emissiveIntensity: 12, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    const ergosphereMat = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x4400aa, emissiveIntensity: 2, transparent: true, opacity: 0.15, wireframe: true });
    const photonRingMat = new THREE.MeshStandardMaterial({ color: 0xffdd44, emissive: 0xffaa00, emissiveIntensity: 20, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    
    // Registry for animation loop
    const registry = {
        blackHole: null,
        ergosphere: null,
        photonSphere: null,
        accretionRings: [],
        debrisClumps: [],
        plasmaJets: [],
        superradiantBeams: [],
        mirrorPanels: [],
        extractionTowers: [],
        coolingPipes: [],
        magneticToroids: [],
        treadedTires: [],
        stabilizerRings: [],
        operatorScreens: []
    };

    let partIdCounter = 1;
    function addPart(name, desc, matName, func, connections, failEffect, cascade, origPos, scaleExplode = 1.5) {
        parts.push({
            name: `[${partIdCounter++}] ${name}`,
            description: desc,
            material: matName,
            function: func,
            assemblyOrder: partIdCounter,
            connections: connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: { x: origPos.x, y: origPos.y, z: origPos.z },
            explodedPosition: { x: origPos.x * scaleExplode, y: origPos.y * scaleExplode, z: origPos.z * scaleExplode }
        });
    }

    // ============================================================================
    // 1. BLACK HOLE SINGULARITY & ERGOSPHERE
    // ============================================================================
    function createKerrBlackHole() {
        const bhGroup = new THREE.Group();

        // The Event Horizon (Oblate Spheroid)
        const bhGeo = new THREE.SphereGeometry(10, 128, 128);
        const bhMesh = new THREE.Mesh(bhGeo, voidBlack);
        bhMesh.scale.set(1.2, 0.8, 1.2); // Oblate due to extreme spin
        bhGroup.add(bhMesh);
        registry.blackHole = bhMesh;

        addPart('Event_Horizon_Oblate', 'The boundary of no return. Spun up to 0.99c, it bulges at the equator.', 'Pure Void Black', 'Gravitational anchor and primary rotational energy source.', ['Ergosphere', 'Photon_Ring'], 'Instant Spaghettification', ['Total collapse of local spacetime'], new THREE.Vector3(0,0,0));

        // The Ergosphere (Pumpkin shaped)
        const ergoGeo = new THREE.SphereGeometry(1, 128, 128);
        const positions = ergoGeo.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const radius = Math.sqrt(x*x + y*y + z*z);
            const phi = Math.acos(y / radius); // latitude
            const rErgo = 10 + 8 * Math.sin(phi); // Max bulge at equator
            positions.setXYZ(i, x * rErgo, y * rErgo, z * rErgo);
        }
        ergoGeo.computeVertexNormals();
        const ergoMesh = new THREE.Mesh(ergoGeo, ergosphereMat);
        bhGroup.add(ergoMesh);
        registry.ergosphere = ergoMesh;

        addPart('Ergosphere_Boundary', 'The region where spacetime is dragged faster than light. Particles must co-rotate.', 'Quantum Spacetime Mesh', 'Enables Penrose process and superradiant scattering.', ['Event_Horizon', 'Accretion_Disk'], 'Loss of rotational energy tapping', ['Stalling of superradiant amplification'], new THREE.Vector3(0,0,0), 1.2);

        // Photon Sphere
        const photonGeo = new THREE.SphereGeometry(14, 64, 64);
        const photonMesh = new THREE.Mesh(photonGeo, photonRingMat);
        photonMesh.scale.set(1.1, 0.9, 1.1);
        bhGroup.add(photonMesh);
        registry.photonSphere = photonMesh;

        return bhGroup;
    }

    // ============================================================================
    // 2. ACCRETION DISK (EXTREME DETAIL)
    // ============================================================================
    function createAccretionDisk() {
        const diskGroup = new THREE.Group();

        // 50 High-res hot rings
        for (let r = 16; r < 35; r += 0.4) {
            const ringGeo = new THREE.RingGeometry(r, r + 0.35, 128);
            const emissiveVal = Math.max(0, (35 - r) / 19); 
            const ringMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.1 * emissiveVal, 1.0, 0.5),
                emissive: new THREE.Color().setHSL(0.1 * emissiveVal, 1.0, 0.5),
                emissiveIntensity: emissiveVal * 15,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7 + (Math.random() * 0.3)
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.rotation.x += (Math.random() - 0.5) * 0.05; // Chaotic tilt
            ring.rotation.y += (Math.random() - 0.5) * 0.05;
            
            // Store Keplerian speed (faster closer to BH)
            ring.userData = { speed: 0.02 * Math.pow(r, -1.5) * 100 };
            
            diskGroup.add(ring);
            registry.accretionRings.push(ring);
        }

        addPart('Accretion_Disk_Plasma_Rings', 'Superheated plasma spiraling inward, creating immense magnetic fields.', 'Superheated Plasma', 'Generates secondary power and x-ray emissions.', ['Magnetic_Toroids', 'Ergosphere'], 'Thermal runaway', ['Vaporization of inner mirror shell'], new THREE.Vector3(25, 0, 0));

        // Thousands of glowing debris clumps
        const debrisGeo = new THREE.DodecahedronGeometry(0.4, 1);
        for (let i = 0; i < 1200; i++) {
            const distance = 16 + Math.random() * 18;
            const angle = Math.random() * Math.PI * 2;
            const yOffset = (Math.random() - 0.5) * (35 - distance) * 0.15;
            
            const mat = Math.random() > 0.2 ? darkSteel : neonRed;
            const debris = new THREE.Mesh(debrisGeo, mat);
            
            debris.position.set(Math.cos(angle) * distance, yOffset, Math.sin(angle) * distance);
            const scale = 0.2 + Math.random() * 1.5;
            debris.scale.set(scale, scale, scale);
            debris.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            
            debris.userData = {
                angle: angle,
                dist: distance,
                yOff: yOffset,
                speed: 0.02 * Math.pow(distance, -1.5) * 100,
                rotX: Math.random() * 0.1,
                rotY: Math.random() * 0.1
            };
            
            diskGroup.add(debris);
            registry.debrisClumps.push(debris);
        }

        return diskGroup;
    }

    // ============================================================================
    // 3. POLAR RELATIVISTIC JETS
    // ============================================================================
    function createPlasmaJets() {
        const jetsGroup = new THREE.Group();
        
        const createJet = (direction) => {
            const jetGeo = new THREE.CylinderGeometry(0.1, 8, 120, 32, 32, true);
            const jet = new THREE.Mesh(jetGeo, plasmaMat);
            jet.position.y = direction * 60;
            if (direction < 0) jet.rotation.x = Math.PI;
            
            // Nested inner glowing core
            const coreGeo = new THREE.CylinderGeometry(0.1, 3, 110, 16, 1, true);
            const core = new THREE.Mesh(coreGeo, neonCyan);
            core.position.y = direction * 55;
            if (direction < 0) core.rotation.x = Math.PI;
            
            jetsGroup.add(jet);
            jetsGroup.add(core);
            
            registry.plasmaJets.push({ mesh: jet, baseScale: 1, dir: direction });
            registry.plasmaJets.push({ mesh: core, baseScale: 1, dir: direction });
        };
        
        createJet(1);  // North
        createJet(-1); // South

        addPart('Relativistic_Polar_Jets', 'Blandford-Znajek process ejecting matter at 0.999c along the magnetic axis.', 'Astrophysical Plasma', 'Prevents black hole mass from increasing uncontrollably.', ['Event_Horizon', 'Magnetic_Toroids'], 'Backflow of radiation', ['Destruction of poles', 'Loss of magnetic confinement'], new THREE.Vector3(0, 60, 0));

        return jetsGroup;
    }

    // ============================================================================
    // 4. MIRROR SHELL (PERFECT REFLECTOR MEGADOME)
    // ============================================================================
    function createMirrorShell(radius) {
        const shellGroup = new THREE.Group();
        
        // Use Icosahedron Detail 3 (~1280 faces) to avoid lagging while maintaining ultra high-tech look
        const isoGeo = new THREE.IcosahedronGeometry(radius, 3); 
        const index = isoGeo.getIndex();
        const pos = isoGeo.getAttribute('position');
        
        let panelCount = 0;
        
        for (let i = 0; i < index.count; i += 3) {
            const a = index.getX(i);
            const b = index.getX(i+1);
            const c = index.getX(i+2);
            
            const v1 = new THREE.Vector3().fromBufferAttribute(pos, a);
            const v2 = new THREE.Vector3().fromBufferAttribute(pos, b);
            const v3 = new THREE.Vector3().fromBufferAttribute(pos, c);
            
            const center = v1.clone().add(v2).add(v3).divideScalar(3);
            
            const rand = Math.random();
            if (rand < 0.05) continue; // Leaves structural holes for extractors
            
            let materialToUse;
            if (rand < 0.20) {
                materialToUse = tinted; // Containment observation window
            } else if (rand < 0.35) {
                materialToUse = darkSteel; // Armor plate
            } else {
                materialToUse = chrome; // Perfect mirror for bouncing radiation
            }
            
            const scale = materialToUse === tinted ? 0.88 : 0.96; // Windows have wider framing gaps
            
            const v1_s = v1.clone().lerp(center, 1 - scale);
            const v2_s = v2.clone().lerp(center, 1 - scale);
            const v3_s = v3.clone().lerp(center, 1 - scale);
            
            const triGeo = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                v1_s.x, v1_s.y, v1_s.z,
                v2_s.x, v2_s.y, v2_s.z,
                v3_s.x, v3_s.y, v3_s.z
            ]);
            triGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            triGeo.computeVertexNormals();
            
            const mesh = new THREE.Mesh(triGeo, materialToUse);
            shellGroup.add(mesh);
            registry.mirrorPanels.push(mesh);
            
            // Add inward pointing structural struts for solid panels
            if (materialToUse !== tinted) {
                const strutDepth = 1.5; 
                const v1_d = v1_s.clone().multiplyScalar((radius - strutDepth) / radius);
                const v2_d = v2_s.clone().multiplyScalar((radius - strutDepth) / radius);
                const v3_d = v3_s.clone().multiplyScalar((radius - strutDepth) / radius);
                
                const innerTriGeo = new THREE.BufferGeometry();
                const innerVerts = new Float32Array([
                    v3_d.x, v3_d.y, v3_d.z, // Reversed winding for inward facing normals
                    v2_d.x, v2_d.y, v2_d.z,
                    v1_d.x, v1_d.y, v1_d.z, 
                ]);
                innerTriGeo.setAttribute('position', new THREE.BufferAttribute(innerVerts, 3));
                innerTriGeo.computeVertexNormals();
                
                const strutMesh = new THREE.Mesh(innerTriGeo, steel);
                shellGroup.add(strutMesh);
            }
            panelCount++;
        }

        addPart('Super_Reflective_Mirror_Shell', `Constructed of ${panelCount} discrete quantum-mirrored chrome panels.`, 'Quantum Chrome / Dark Steel', 'Traps electromagnetic waves to induce exponential superradiant amplification.', ['Extraction_Towers', 'Cooling_Network'], 'Radiation pressure breach', ['Thermonuclear shockwave', 'Megastructure vaporization'], new THREE.Vector3(radius, 0, 0), 1.2);

        // Underlying Wireframe Cage
        const wireGeo = new THREE.IcosahedronGeometry(radius - 0.5, 3);
        const wireMesh = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({
            color: 0x111111, wireframe: true, transparent: true, opacity: 0.6
        }));
        shellGroup.add(wireMesh);

        return shellGroup;
    }

    // ============================================================================
    // 5. SUPERRADIANT SCATTERING BEAMS (GEODESIC RAYTRACING)
    // ============================================================================
    function createSuperradiantBeams(count, mirrorRadius) {
        const beamsGroup = new THREE.Group();
        
        for (let b = 0; b < count; b++) {
            // Start just outside ergosphere
            const startPos = new THREE.Vector3(
                (Math.random() - 0.5) * 24,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 24
            );
            
            let pos = startPos.clone();
            let vel = pos.clone().normalize().add(new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5)).normalize().multiplyScalar(1.5);
            
            const path = [pos.clone()];
            
            // Physics simulation of geodesic paths
            for (let i = 0; i < 200; i++) {
                let r2 = pos.lengthSq();
                if (r2 < 144) break; // Absorbed into ergosphere / black hole
                
                // Gravity vector
                let grav = pos.clone().normalize().multiplyScalar(-30 / r2);
                
                // Frame dragging (Lense-Thirring effect) - intense near equator
                let frameDrag = new THREE.Vector3(-pos.z, 0, pos.x).normalize().multiplyScalar(80 / r2);
                
                vel.add(grav).add(frameDrag);
                vel.normalize().multiplyScalar(3.0); // Keep speed constant
                pos.add(vel);
                
                // Reflection at the mirror shell
                if (pos.length() > mirrorRadius - 1) {
                    pos.normalize().multiplyScalar(mirrorRadius - 1);
                    let n = pos.clone().normalize();
                    let dot = vel.dot(n);
                    vel.sub(n.multiplyScalar(2 * dot)); 
                    
                    // Add slight chaotic scattering
                    vel.add(new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3)).normalize().multiplyScalar(3.0);
                }
                path.push(pos.clone());
            }
            
            if (path.length > 5) {
                const curve = new THREE.CatmullRomCurve3(path);
                const tubeGeo = new THREE.TubeGeometry(curve, path.length * 3, 0.15, 6, false);
                const beam = new THREE.Mesh(tubeGeo, neonCyan);
                beamsGroup.add(beam);
                registry.superradiantBeams.push(beam);
            }
        }

        addPart('Trapped_Electromagnetic_Waves', 'Exponentially growing waves of radiation trapped between the event horizon and the mirror shell.', 'Photons / Neon Cyan', 'Extracts rotational energy via superradiance.', ['Mirror_Shell', 'Ergosphere'], 'Runaway exponential growth', ['Explosive structural failure'], new THREE.Vector3(25, 25, 25));

        return beamsGroup;
    }

    // ============================================================================
    // 6. PROCEDURAL COOLING NETWORK
    // ============================================================================
    function createCoolingNetwork(radius, numPipes) {
        const network = new THREE.Group();
        
        for (let p = 0; p < numPipes; p++) {
            const points = [];
            let theta = Math.random() * Math.PI * 2;
            let phi = Math.random() * Math.PI;
            
            for (let i = 0; i < 60; i++) {
                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                points.push(new THREE.Vector3(x, y, z));
                
                // Wandering path along the sphere surface
                theta += (Math.random() - 0.5) * 0.3;
                phi += (Math.random() - 0.5) * 0.3;
                phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi)); // Avoid poles
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.4, 8, false);
            const tube = new THREE.Mesh(tubeGeo, copper);
            network.add(tube);
            registry.coolingPipes.push(tube);
        }

        addPart('Cryogenic_Cooling_Network', 'Miles of complex tubing circulating liquid helium across the mirror shell.', 'Copper / Cryofluids', 'Prevents the shell from melting due to immense radiation pressure and thermal soak.', ['Mirror_Shell', 'Extraction_Towers'], 'Overheating', ['Shell warping', 'Containment breach'], new THREE.Vector3(radius, 0, 0), 1.1);

        return network;
    }

    // ============================================================================
    // 7. HIGH-DETAIL ENERGY EXTRACTION TOWERS WITH LATHES & HYDRAULICS
    // ============================================================================
    function createPiston(start, end) {
        const group = new THREE.Group();
        const dist = start.distanceTo(end);
        const dir = end.clone().sub(start).normalize();
        
        // Outer Cylinder
        const cyl1Geo = new THREE.CylinderGeometry(0.6, 0.6, dist * 0.6, 16);
        const cyl1 = new THREE.Mesh(cyl1Geo, darkSteel);
        
        // Inner Cylinder (Shiny)
        const cyl2Geo = new THREE.CylinderGeometry(0.35, 0.35, dist * 0.5, 16);
        const cyl2 = new THREE.Mesh(cyl2Geo, chrome);
        
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        
        cyl1.position.copy(start.clone().lerp(end, 0.3));
        cyl1.quaternion.copy(quaternion);
        
        cyl2.position.copy(start.clone().lerp(end, 0.7));
        cyl2.quaternion.copy(quaternion);
        
        group.add(cyl1);
        group.add(cyl2);
        return group;
    }

    function createOperatorCabin(yPos) {
        const cabin = new THREE.Group();
        cabin.position.y = yPos;
        cabin.position.z = 3.5;
        
        const box = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2.5), steel);
        cabin.add(box);
        
        const window = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 2.6), tinted);
        window.position.y = 0.2;
        cabin.add(window);
        
        // Inside details (joysticks and screens)
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.6), neonBlue);
        screen.position.set(0, 0.2, 1.25);
        screen.rotation.y = Math.PI;
        cabin.add(screen);
        registry.operatorScreens.push(screen);
        
        const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8), darkSteel);
        joystick.position.set(0.5, -0.2, 0.8);
        joystick.rotation.x = Math.PI / 4;
        cabin.add(joystick);
        
        return cabin;
    }

    function createExtractionTowers(radius, count) {
        const towersGroup = new THREE.Group();
        
        for (let i = 0; i < count; i++) {
            const tower = new THREE.Group();
            
            // Random spherical distribution
            const phi = Math.acos( -1 + ( 2 * i ) / count );
            const theta = Math.sqrt( count * Math.PI ) * phi;
            
            const pos = new THREE.Vector3(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
            
            const normal = pos.clone().normalize();
            
            // Lathe Geometry Base
            const points = [];
            for ( let j = 0; j < 25; j ++ ) {
                points.push( new THREE.Vector2( Math.sin( j * 0.15 ) * 1.5 + 1.5, j * 0.4 ) );
            }
            const latheGeo = new THREE.LatheGeometry(points, 32);
            const lathe = new THREE.Mesh(latheGeo, steel);
            tower.add(lathe);
            
            // Glowing Capacitor Core
            const coreGeo = new THREE.CapsuleGeometry(0.8, 6, 16, 16);
            const core = new THREE.Mesh(coreGeo, neonBlue);
            core.position.y = 12;
            tower.add(core);
            
            // Magnetic Constriction Rings
            for (let r = 0; r < 5; r++) {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8 + r*0.2, 0.2, 16, 64), copper);
                ring.position.y = 9 + r * 1.2;
                ring.rotation.x = Math.PI/2;
                tower.add(ring);
            }
            
            // Add Operator Cabin partway up
            tower.add(createOperatorCabin(6));
            
            // Support Hydraulics connecting tower to shell
            const p1 = createPiston(new THREE.Vector3(2, 4, 0), new THREE.Vector3(4, -2, 0));
            const p2 = createPiston(new THREE.Vector3(-2, 4, 0), new THREE.Vector3(-4, -2, 0));
            const p3 = createPiston(new THREE.Vector3(0, 4, 2), new THREE.Vector3(0, -2, 4));
            const p4 = createPiston(new THREE.Vector3(0, 4, -2), new THREE.Vector3(0, -2, -4));
            tower.add(p1, p2, p3, p4);
            
            // Align tower to face outward from sphere center
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), normal);
            tower.quaternion.copy(quaternion);
            tower.position.copy(pos);
            
            towersGroup.add(tower);
            registry.extractionTowers.push(core);
        }

        addPart('Energy_Extraction_Towers', 'Massive lathed structures housing capacitor banks and operator cabins. These bleed off the amplified waves before they shatter the mirror.', 'Steel / Neon Capacitors', 'Extracts and stores superradiant energy.', ['Mirror_Shell', 'Capacitor_Banks'], 'Inability to bleed energy', ['Catastrophic mirror detonation'], new THREE.Vector3(radius+10, 0, 0), 1.5);
        addPart('Hydraulic_Support_Struts', 'Heavy-duty pistons anchoring the extraction towers to the curved shell.', 'Dark Steel / Chrome', 'Provides structural rigidity against violent vibrations.', ['Extraction_Towers', 'Mirror_Shell'], 'Tower snap-off', ['Localized decompression'], new THREE.Vector3(radius+5, 0, 0), 1.5);
        addPart('Operator_Cabins', 'Pressurized observation decks for suicidal engineers monitoring the process.', 'Steel / Tinted Glass', 'Manual override and telemetry monitoring.', ['Extraction_Towers'], 'Cabin depressurization', ['Loss of manual control'], new THREE.Vector3(radius+12, 0, 0), 1.5);

        return towersGroup;
    }

    // ============================================================================
    // 8. MAGNETIC CONFINEMENT TOROIDS
    // ============================================================================
    function createMagneticToroids(radius) {
        const toroidGroup = new THREE.Group();
        
        const createToroid = (yOff, scale) => {
            const torGeo = new THREE.TorusGeometry(radius * scale, 1.5, 32, 128);
            const torMesh = new THREE.Mesh(torGeo, darkSteel);
            torMesh.position.y = yOff;
            torMesh.rotation.x = Math.PI / 2;
            
            // Add glowing superconducting wire wrapping
            const wireGeo = new THREE.TorusKnotGeometry(radius * scale, 0.4, 256, 32, 1, 40);
            const wireMesh = new THREE.Mesh(wireGeo, neonBlue);
            wireMesh.position.y = yOff;
            wireMesh.rotation.x = Math.PI / 2;
            
            toroidGroup.add(torMesh);
            toroidGroup.add(wireMesh);
            registry.magneticToroids.push(wireMesh);
        };
        
        createToroid(25, 0.85);
        createToroid(10, 1.05);
        createToroid(-10, 1.05);
        createToroid(-25, 0.85);

        addPart('Magnetic_Confinement_Toroids', 'Giant superconducting rings generating poloidal fields to confine the plasma and shape the jets.', 'Dark Steel / Superconductors', 'Plasma containment and jet acceleration.', ['Mirror_Shell', 'Plasma_Jets'], 'Magnetic quench', ['Plasma impact on mirror shell'], new THREE.Vector3(0, 25, radius));

        return toroidGroup;
    }

    // ============================================================================
    // 9. HIGHLY DETAILED TREADED TIRES & STABILIZER RINGS
    // ============================================================================
    function createTreadedTire() {
        const tireGroup = new THREE.Group();
        
        // Main torus tire
        const tireGeo = new THREE.TorusGeometry(4.0, 1.2, 32, 100);
        const tireMesh = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(tireMesh);
        
        // Extremely detailed extruded BoxGeometry lugs (Aggressive Tread)
        const lugGeo = new THREE.BoxGeometry(1.8, 0.6, 1.0);
        for (let i = 0; i < 120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * 5.0, Math.sin(angle) * 5.0, 0);
            lug.rotation.z = angle;
            
            // Chevron pattern offset
            if (i % 2 === 0) {
                lug.position.z = 0.4;
                lug.rotation.x = 0.2;
            } else {
                lug.position.z = -0.4;
                lug.rotation.x = -0.2;
            }
            tireGroup.add(lug);
        }
        
        // Rim (Cylinder with complex spoke arrays)
        const rimGeo = new THREE.CylinderGeometry(3.0, 3.0, 1.5, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);
        
        // Spoke array
        const spokeGeo = new THREE.CylinderGeometry(0.15, 0.15, 6.0, 16);
        for (let j = 0; j < 10; j++) {
            const spokeAngle = (j / 10) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = spokeAngle;
            rim.add(spoke);
            
            // Inner Hub Nuts
            const hubNut = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.8, 6), darkSteel);
            hubNut.rotation.x = Math.PI / 2;
            tireGroup.add(hubNut);
        }
        
        return tireGroup;
    }

    function createStabilizerGimbals(radius) {
        const gimbalGroup = new THREE.Group();
        
        const createRing = (r, axis) => {
            const ringGroup = new THREE.Group();
            
            // The massive ring structure
            const ringGeo = new THREE.TorusGeometry(r, 2.5, 64, 256);
            const ringMesh = new THREE.Mesh(ringGeo, steel);
            ringGroup.add(ringMesh);
            
            // Inner gear teeth
            const toothGeo = new THREE.BoxGeometry(4, 1.5, 3);
            for (let i = 0; i < 180; i++) {
                const angle = (i / 180) * Math.PI * 2;
                const tooth = new THREE.Mesh(toothGeo, darkSteel);
                tooth.position.set(Math.cos(angle) * (r - 2), Math.sin(angle) * (r - 2), 0);
                tooth.rotation.z = angle;
                ringGroup.add(tooth);
            }
            
            // Add Motorized Treaded Tires riding along the ring
            for (let t = 0; t < 8; t++) {
                const angle = (t / 8) * Math.PI * 2;
                const tire = createTreadedTire();
                // Position tire to interlock/roll on the ring
                tire.position.set(Math.cos(angle) * (r + 4), Math.sin(angle) * (r + 4), 0);
                // Orient tire to roll along the tangent
                tire.rotation.z = angle;
                tire.rotation.y = Math.PI / 2;
                
                ringGroup.add(tire);
                registry.treadedTires.push({ mesh: tire, axis: 'x', speed: 0.1 }); 
            }
            
            if (axis === 'x') ringGroup.rotation.y = Math.PI / 2;
            if (axis === 'y') ringGroup.rotation.x = Math.PI / 2;
            if (axis === 'z') ringGroup.rotation.z = Math.PI / 4; // Arbitrary offset
            
            gimbalGroup.add(ringGroup);
            registry.stabilizerRings.push({ mesh: ringGroup, axis: axis });
            return ringGroup;
        };
        
        createRing(radius + 15, 'x');
        createRing(radius + 22, 'y');
        createRing(radius + 29, 'z');

        addPart('Gimbal_Stabilizer_Rings', 'Massive intersecting rings ensuring the megastructure maintains absolute zero net angular momentum relative to the host galaxy.', 'Steel / Dark Steel', 'Gyroscopic stabilization.', ['Mirror_Shell', 'Motorized_Tires'], 'Catastrophic tumble', ['Spacetime tearing tear', 'Structure rips apart'], new THREE.Vector3(radius+22, 0, 0), 1.5);
        addPart('Motorized_Treaded_Tires', 'Heavy-duty torus tires with extruded aggressive rubber lugs and complex chrome rims. These physically rotate the gimbal rings.', 'Rubber / Chrome / Steel', 'Actuation of the massive stabilizer rings.', ['Gimbal_Stabilizer_Rings'], 'Gimbal lock', ['Loss of stabilization'], new THREE.Vector3(radius+19, 0, 0), 1.5);

        return gimbalGroup;
    }

    // ============================================================================
    // BUILD THE FULL MEGASTRUCTURE
    // ============================================================================
    const mirrorRadius = 55;

    const kerrBH = createKerrBlackHole();
    group.add(kerrBH);
    
    const accretionDisk = createAccretionDisk();
    group.add(accretionDisk);
    
    const jets = createPlasmaJets();
    group.add(jets);
    
    const mirrorShell = createMirrorShell(mirrorRadius);
    group.add(mirrorShell);
    
    const superradiantBeams = createSuperradiantBeams(120, mirrorRadius);
    group.add(superradiantBeams);
    
    const coolingPipes = createCoolingNetwork(mirrorRadius + 0.5, 40);
    group.add(coolingPipes);
    
    const extractionTowers = createExtractionTowers(mirrorRadius, 30);
    group.add(extractionTowers);
    
    const magneticToroids = createMagneticToroids(mirrorRadius + 3);
    group.add(magneticToroids);
    
    const gimbals = createStabilizerGimbals(mirrorRadius);
    group.add(gimbals);

    // ============================================================================
    // QUIZ QUESTIONS (PHD LEVEL ASTROPHYSICS / RELATIVITY)
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of Superradiant Scattering within a Kerr Black Hole Bomb, what is the critical condition required for the frequency (ω) of the incoming electromagnetic wave to undergo amplification?",
            options: [
                "ω > m Ω_H, where m is the magnetic quantum number and Ω_H is the event horizon angular velocity.",
                "ω < m Ω_H, where m is the azimuthal quantum number and Ω_H is the angular velocity of the event horizon.",
                "ω = c / r_s, where r_s is the Schwarzschild radius.",
                "The wave must have negative energy as measured by an observer co-rotating with the ergosphere."
            ],
            correctAnswer: 1,
            explanation: "For superradiance to occur, the angular phase velocity of the wave must be less than the angular velocity of the black hole horizon. In this regime, the wave effectively has 'negative energy' relative to the black hole, allowing it to extract rotational energy."
        },
        {
            question: "The Penrose Process allows energy extraction by dropping a particle into the ergosphere that subsequently splits into two. What must be true about the trajectory of the absorbed particle's piece for net energy gain?",
            options: [
                "It must achieve an escape velocity greater than c.",
                "It must cross the Cauchy horizon with infinite blue-shift.",
                "It must follow a trajectory corresponding to a negative total energy state as measured by an observer at spatial infinity.",
                "It must possess a spin vector perfectly anti-aligned with the black hole's angular momentum."
            ],
            correctAnswer: 2,
            explanation: "Inside the ergosphere, the Killing vector that represents time translation at infinity becomes spacelike. This allows particles to exist in states that, to a distant observer, possess negative total energy. Absorbing this negative energy particle decreases the black hole's mass and angular momentum, transferring the excess to the escaping particle."
        },
        {
            question: "Frame-dragging (the Lense-Thirring effect) forces all particles and photons to co-rotate with a spinning black hole. Within which specific boundary is it absolutely impossible for any object to appear stationary to an observer at infinity?",
            options: [
                "The Photon Sphere",
                "The Inner Event Horizon (Cauchy Horizon)",
                "The Ergosphere, bounded by the stationary limit surface",
                "The Innermost Stable Circular Orbit (ISCO)"
            ],
            correctAnswer: 2,
            explanation: "The outer boundary of the ergosphere is the stationary limit surface. Within this boundary, spacetime itself is dragged so rapidly that an object would have to travel faster than light in the opposite direction just to stand still relative to infinity."
        },
        {
            question: "If our God-Tier mirror shell is placed perfectly, trapping the radiation, what causes the theoretical 'Black Hole Bomb' to eventually fail catastrophically if energy is not extracted?",
            options: [
                "The black hole's spin approaches a > M, naked singularity exposure instantly vaporizes the shell.",
                "The exponential growth of trapped superradiant waves inevitably overcomes the tensile strength of the mirror via immense radiation pressure, causing a catastrophic explosion.",
                "The Hawking radiation overwhelms the superradiant waves, freezing the entire structure.",
                "The Penrose process reverses, pulling the mirror shell into the singularity."
            ],
            correctAnswer: 1,
            explanation: "Because the amplification happens every time the wave bounces off the mirror and passes through the ergosphere, the energy grows exponentially. Without extraction towers, the immense radiation pressure of the trapped photons will eventually exceed the physical structural limits of any matter."
        },
        {
            question: "In our megastructure's magnetic confinement toroids, what is the primary purpose of applying a massive poloidal magnetic field aligned with the spin axis of the black hole?",
            options: [
                "To shield the operator cabins from Hawking radiation.",
                "To facilitate the Blandford-Znajek process, extracting rotational energy via electron-positron pair cascades and accelerating them into polar relativistic jets.",
                "To freeze the accretion disk into a solid state to prevent frame-dragging.",
                "To increase the mass of the black hole by absorbing magnetic monopoles."
            ],
            correctAnswer: 1,
            explanation: "The Blandford-Znajek mechanism relies on strong magnetic fields threading the event horizon. The spinning spacetime twists these field lines, driving immense currents and generating relativistic jets along the poles, acting as an electromagnetic dynamo."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    let time = 0;
    
    function animate(delta, speed = 1, meshes) {
        time += delta * speed;
        
        // 1. Black Hole and Ergosphere rotation
        if (registry.blackHole) {
            // It's pure black so visually spinning it does nothing, but we do it for completeness
            registry.blackHole.rotation.y -= 0.1 * speed;
        }
        if (registry.ergosphere) {
            // Rapid frame dragging rotation
            registry.ergosphere.rotation.y -= 0.5 * speed; 
            // Pulse the emission
            registry.ergosphere.material.emissiveIntensity = 2 + Math.sin(time * 5) * 1.5;
        }
        if (registry.photonSphere) {
            registry.photonSphere.rotation.y -= 0.8 * speed;
            registry.photonSphere.material.emissiveIntensity = 15 + Math.sin(time * 10) * 5;
        }
        
        // 2. Accretion Disk (Keplerian dynamics)
        registry.accretionRings.forEach(ring => {
            ring.rotation.z -= ring.userData.speed * speed;
            // Wobble
            ring.rotation.x += Math.sin(time * 2 + ring.userData.speed) * 0.001 * speed;
        });
        
        registry.debrisClumps.forEach(debris => {
            debris.userData.angle -= debris.userData.speed * speed;
            debris.position.x = Math.cos(debris.userData.angle) * debris.userData.dist;
            debris.position.z = Math.sin(debris.userData.angle) * debris.userData.dist;
            // Wobble up and down slightly
            debris.position.y = debris.userData.yOff + Math.sin(time * 3 + debris.userData.angle) * 0.5;
            
            debris.rotation.x += debris.userData.rotX * speed;
            debris.rotation.y += debris.userData.rotY * speed;
        });
        
        // 3. Plasma Jets (Pulsing and scaling)
        registry.plasmaJets.forEach(jetObj => {
            const { mesh, dir } = jetObj;
            // Rapid chaotic pulsing
            mesh.scale.x = 1 + Math.random() * 0.2;
            mesh.scale.z = 1 + Math.random() * 0.2;
            mesh.scale.y = 1 + Math.sin(time * 15 + dir) * 0.05;
            mesh.material.opacity = 0.5 + Math.random() * 0.3;
        });
        
        // 4. Superradiant Beams (Intense blinking/traveling effects)
        registry.superradiantBeams.forEach((beam, idx) => {
            // Make them blink to simulate traveling wave packets
            const phase = time * 20 + idx;
            beam.material.opacity = Math.max(0, Math.sin(phase)) * 0.8;
            beam.material.emissiveIntensity = 20 + Math.max(0, Math.sin(phase)) * 30;
        });
        
        // 5. Extraction Towers (Capacitor charging pulses)
        registry.extractionTowers.forEach((core, idx) => {
            // Slow build up, then rapid discharge
            const chargeCycle = (time * 0.5 + idx * 0.1) % 1.0;
            if (chargeCycle < 0.9) {
                core.material.emissiveIntensity = chargeCycle * 20; // Build up
                core.material.color.setHex(0x0044aa);
            } else {
                core.material.emissiveIntensity = 50; // FLASH
                core.material.color.setHex(0xffffff);
            }
        });
        
        // 6. Magnetic Toroids (Energy flowing through wires)
        registry.magneticToroids.forEach((wire, idx) => {
            wire.rotation.z += 0.05 * speed;
            wire.material.emissiveIntensity = 8 + Math.sin(time * 8 + idx) * 4;
        });
        
        // 7. Stabilizer Gimbal Rings
        registry.stabilizerRings.forEach(gimbal => {
            if (gimbal.axis === 'x') gimbal.mesh.rotation.x += 0.005 * speed;
            if (gimbal.axis === 'y') gimbal.mesh.rotation.y += 0.007 * speed;
            if (gimbal.axis === 'z') gimbal.mesh.rotation.z += 0.004 * speed;
        });
        
        // 8. Treaded Tires (Rolling along the rings)
        registry.treadedTires.forEach(tireObj => {
            // The tires spin on their local X axis as they 'drive' the gimbal
            tireObj.mesh.rotation.x -= 0.1 * speed;
        });
        
        // 9. Operator Screens flickering
        registry.operatorScreens.forEach(screen => {
            screen.material.emissiveIntensity = Math.random() > 0.1 ? 5 : 0.5; // Glitchy telemetry
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
