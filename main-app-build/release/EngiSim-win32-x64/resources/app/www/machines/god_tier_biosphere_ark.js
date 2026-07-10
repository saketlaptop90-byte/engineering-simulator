import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    const description = "Generational Biosphere Ark (God Tier). A massive, continent-sized mothership fleet designed to preserve the genetic code of a million extinct worlds across millennia. Features fully functioning artificial gravity rings, 5 distinct highly detailed alien biomes protected by transparent physical domes, and a massive sub-light fusion drive with glowing plasma exhaust. Surrounding the mothership is an autonomous escort fleet and a pulsing multi-phasic asteroid deflector shield.";

    // ==========================================
    // HYPER-TECH CUSTOM MATERIALS & MODIFICATIONS
    // ==========================================
    
    // We clone base materials to create emissive, glowing, and hyper-realistic variants
    const emissiveBlue = chrome.clone();
    emissiveBlue.emissive = new THREE.Color(0x0066ff);
    emissiveBlue.emissiveIntensity = 3.5;
    emissiveBlue.wireframe = false;

    const emissiveRed = chrome.clone();
    emissiveRed.emissive = new THREE.Color(0xff1100);
    emissiveRed.emissiveIntensity = 4.0;

    const emissiveGreen = chrome.clone();
    emissiveGreen.emissive = new THREE.Color(0x00ff33);
    emissiveGreen.emissiveIntensity = 3.0;
    
    const emissiveYellow = chrome.clone();
    emissiveYellow.emissive = new THREE.Color(0xffcc00);
    emissiveYellow.emissiveIntensity = 2.5;

    const transparentDome = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.98,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.55,
        thickness: 2.0,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const matBiomeBase = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1.0, metalness: 0.0 });
    const matRedJungle = new THREE.MeshStandardMaterial({ color: 0x660000, roughness: 0.9, metalness: 0.1 });
    const matCrystal = new THREE.MeshPhysicalMaterial({
        color: 0x88ffff, transmission: 0.9, opacity: 1, metalness: 0.3, roughness: 0.1, 
        emissive: 0x004488, emissiveIntensity: 1.2, clearcoat: 1.0
    });
    const matOcean = new THREE.MeshPhysicalMaterial({
        color: 0x003399, transmission: 0.85, opacity: 0.9, metalness: 0.1, roughness: 0.1,
        side: THREE.DoubleSide, clearcoat: 0.8
    });
    const matFungal = new THREE.MeshStandardMaterial({ color: 0x225522, emissive: 0x002200, emissiveIntensity: 0.5, roughness: 0.8 });
    const matIce = new THREE.MeshPhysicalMaterial({
        color: 0xddeeff, transmission: 0.7, opacity: 0.9, metalness: 0.05, roughness: 0.2, clearcoat: 0.9
    });
    
    const matEnginePlume = new THREE.MeshBasicMaterial({ 
        color: 0x00aaff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, side: THREE.DoubleSide 
    });

    const shieldMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x0088ff, transmission: 0.9, opacity: 0.2, transparent: true, 
        emissive: 0x002288, emissiveIntensity: 0.8, wireframe: true 
    });

    // ==========================================
    // PROCEDURAL GEOMETRY GENERATORS
    // ==========================================

    function buildTrussArm(length, width, mat) {
        const armGroup = new THREE.Group();
        
        // 4 Main longitudinal titanium beams
        const pipeGeo = new THREE.CylinderGeometry(width * 0.1, width * 0.1, length, 12);
        for (let i = 0; i < 4; i++) {
            const pipe = new THREE.Mesh(pipeGeo, mat);
            const x = (i % 2 === 0 ? 1 : -1) * width / 2;
            const z = (i < 2 ? 1 : -1) * width / 2;
            pipe.position.set(x, length / 2, z);
            armGroup.add(pipe);
        }

        // Extremely detailed cross-bracing matrix
        const numBraces = Math.floor(length / (width * 1.5));
        const step = length / numBraces;
        const braceGeo = new THREE.CylinderGeometry(width * 0.05, width * 0.05, width, 8);
        
        const braceInstX = new THREE.InstancedMesh(braceGeo, mat, numBraces * 2);
        const braceInstZ = new THREE.InstancedMesh(braceGeo, mat, numBraces * 2);
        const dummy = new THREE.Object3D();

        let countX = 0, countZ = 0;
        for (let i = 0; i < numBraces; i++) {
            const y = i * step + step / 2;
            
            // X-axis braces
            dummy.rotation.set(0, 0, Math.PI / 2);
            dummy.position.set(0, y, width / 2);
            dummy.updateMatrix();
            braceInstX.setMatrixAt(countX++, dummy.matrix);
            
            dummy.position.set(0, y, -width / 2);
            dummy.updateMatrix();
            braceInstX.setMatrixAt(countX++, dummy.matrix);

            // Z-axis braces
            dummy.rotation.set(Math.PI / 2, 0, 0);
            dummy.position.set(width / 2, y, 0);
            dummy.updateMatrix();
            braceInstZ.setMatrixAt(countZ++, dummy.matrix);
            
            dummy.position.set(-width / 2, y, 0);
            dummy.updateMatrix();
            braceInstZ.setMatrixAt(countZ++, dummy.matrix);
        }
        
        armGroup.add(braceInstX);
        armGroup.add(braceInstZ);

        // Diagonal reinforcing tension cables
        const diagDist = Math.sqrt(step * step + width * width);
        const diagAngle = Math.atan2(width, step);
        const diagGeo = new THREE.CylinderGeometry(width * 0.02, width * 0.02, diagDist, 8);
        const diagInst = new THREE.InstancedMesh(diagGeo, mat, numBraces * 4);
        let countDiag = 0;

        for (let i = 0; i < numBraces; i++) {
            const y = i * step + step / 2;
            
            // Face 1
            dummy.rotation.set(0, 0, diagAngle);
            dummy.position.set(0, y + step / 2, width / 2);
            dummy.updateMatrix();
            diagInst.setMatrixAt(countDiag++, dummy.matrix);
            // Face 2
            dummy.rotation.set(0, 0, -diagAngle);
            dummy.position.set(0, y + step / 2, -width / 2);
            dummy.updateMatrix();
            diagInst.setMatrixAt(countDiag++, dummy.matrix);
            // Face 3
            dummy.rotation.set(diagAngle, 0, 0);
            dummy.position.set(width / 2, y + step / 2, 0);
            dummy.updateMatrix();
            diagInst.setMatrixAt(countDiag++, dummy.matrix);
            // Face 4
            dummy.rotation.set(-diagAngle, 0, 0);
            dummy.position.set(-width / 2, y + step / 2, 0);
            dummy.updateMatrix();
            diagInst.setMatrixAt(countDiag++, dummy.matrix);
        }
        armGroup.add(diagInst);

        // Internal nutrient/power conduits
        const conduitGeo = new THREE.CylinderGeometry(width * 0.15, width * 0.15, length, 16);
        const conduit = new THREE.Mesh(conduitGeo, emissiveBlue);
        conduit.position.set(0, length / 2, 0);
        armGroup.add(conduit);

        return armGroup;
    }

    // ==========================================
    // BIOME GENERATION LOGIC
    // ==========================================

    const domeRadius = 160;
    const platformRadius = 155;
    const platformThickness = 8;

    function createDomeShell() {
        const shellGroup = new THREE.Group();
        const domeGeo = new THREE.IcosahedronGeometry(domeRadius, 4);
        const glassMesh = new THREE.Mesh(domeGeo, transparentDome);
        
        const wireframeGeo = new THREE.WireframeGeometry(domeGeo);
        const wireframeMat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });
        const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
        
        shellGroup.add(glassMesh);
        shellGroup.add(wireframe);
        return shellGroup;
    }

    function buildRedJungle() {
        const biomeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius, platformRadius, platformThickness, 64), matBiomeBase);
        biomeGroup.add(base);

        // Terrain unevenness
        const terrainGeo = new THREE.SphereGeometry(platformRadius * 0.95, 64, 32, 0, Math.PI * 2, 0, Math.PI / 4);
        const terrain = new THREE.Mesh(terrainGeo, matRedJungle);
        terrain.position.y = platformThickness / 2 - 20;
        terrain.scale.y = 0.3; // flatten the sphere into a hill
        biomeGroup.add(terrain);

        // Instanced Fractal-like Flora (Twisted Trunks)
        const trunkGeo = new THREE.CylinderGeometry(1.5, 0.5, 15, 8);
        trunkGeo.translate(0, 7.5, 0);
        const trunkCount = 3500;
        const trunkInst = new THREE.InstancedMesh(trunkGeo, darkSteel, trunkCount);
        
        // Canopy Leaves (Emissive Red Orbs)
        const leafGeo = new THREE.SphereGeometry(3, 8, 8);
        const leafInst = new THREE.InstancedMesh(leafGeo, emissiveRed, trunkCount);

        const dummy = new THREE.Object3D();
        for (let i = 0; i < trunkCount; i++) {
            const r = Math.random() * (platformRadius - 10);
            const theta = Math.random() * Math.PI * 2;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            
            // Calculate height based on terrain curve
            const yDist = Math.sqrt(x*x + z*z);
            const baseHeight = (platformThickness / 2) + Math.cos(yDist * 0.02) * 5;
            
            const heightScale = 0.5 + Math.random() * 1.5;
            
            dummy.position.set(x, baseHeight, z);
            dummy.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
            dummy.scale.set(heightScale, heightScale, heightScale);
            dummy.updateMatrix();
            trunkInst.setMatrixAt(i, dummy.matrix);

            // Leaf positioning at top of trunk
            const leafY = baseHeight + 15 * heightScale * Math.cos(dummy.rotation.x);
            const leafX = x + 15 * heightScale * Math.sin(dummy.rotation.z);
            const leafZ = z - 15 * heightScale * Math.sin(dummy.rotation.x);
            
            dummy.position.set(leafX, leafY, leafZ);
            dummy.rotation.set(0,0,0);
            dummy.scale.set(heightScale, heightScale, heightScale);
            dummy.updateMatrix();
            leafInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(trunkInst);
        biomeGroup.add(leafInst);

        // Atmospheric Spore Weather System
        const sporeCount = 1000;
        const sporeGeo = new THREE.TetrahedronGeometry(0.8, 0);
        const sporeInst = new THREE.InstancedMesh(sporeGeo, emissiveYellow, sporeCount);
        const sporeData = [];
        for (let i = 0; i < sporeCount; i++) {
            const r = Math.random() * platformRadius;
            const theta = Math.random() * Math.PI * 2;
            sporeData.push({
                x: Math.cos(theta) * r,
                y: platformThickness + Math.random() * 80,
                z: Math.sin(theta) * r,
                speed: 0.1 + Math.random() * 0.4,
                offset: Math.random() * 100,
                orbit: Math.random() * 0.02
            });
        }
        biomeGroup.add(sporeInst);

        updatables.push((time, speed) => {
            sporeData.forEach((sp, i) => {
                sp.y += Math.sin(time * sp.speed + sp.offset) * 0.2 * speed;
                sp.x = sp.x * Math.cos(sp.orbit * speed) - sp.z * Math.sin(sp.orbit * speed);
                sp.z = sp.x * Math.sin(sp.orbit * speed) + sp.z * Math.cos(sp.orbit * speed);
                
                if (sp.y > 100) sp.y = platformThickness;
                if (sp.y < platformThickness) sp.y = 100;

                dummy.position.set(sp.x, sp.y, sp.z);
                dummy.rotation.set(time * sp.speed, time * sp.speed, 0);
                dummy.updateMatrix();
                sporeInst.setMatrixAt(i, dummy.matrix);
            });
            sporeInst.instanceMatrix.needsUpdate = true;
        });

        return biomeGroup;
    }

    function buildCrystalDesert() {
        const biomeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius, platformRadius, platformThickness, 64), matBiomeBase);
        biomeGroup.add(base);

        // Sand Dunes (Displaced Plane)
        const duneGeo = new THREE.PlaneGeometry(platformRadius * 2, platformRadius * 2, 64, 64);
        duneGeo.rotateX(-Math.PI / 2);
        const dunePos = duneGeo.attributes.position;
        for (let i = 0; i < dunePos.count; i++) {
            const x = dunePos.getX(i);
            const z = dunePos.getZ(i);
            const dist = Math.sqrt(x*x + z*z);
            if (dist < platformRadius) {
                const y = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 8 + Math.sin(x * 0.1 + z * 0.1) * 3;
                dunePos.setY(i, y);
            } else {
                dunePos.setY(i, -10); // push edges down
            }
        }
        duneGeo.computeVertexNormals();
        const duneMesh = new THREE.Mesh(duneGeo, new THREE.MeshStandardMaterial({ color: 0xccaa77, roughness: 1.0 }));
        duneMesh.position.y = platformThickness / 2;
        biomeGroup.add(duneMesh);

        // Monolithic Crystals
        const crystalGeo = new THREE.OctahedronGeometry(1, 0);
        const crystalCount = 2000;
        const crystalInst = new THREE.InstancedMesh(crystalGeo, matCrystal, crystalCount);
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < crystalCount; i++) {
            const r = Math.random() * (platformRadius - 15);
            const theta = Math.random() * Math.PI * 2;
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            const y = platformThickness / 2 + Math.sin(x * 0.05) * Math.cos(z * 0.05) * 8;
            
            const scaleX = 2 + Math.random() * 4;
            const scaleY = 10 + Math.random() * 40;
            const scaleZ = 2 + Math.random() * 4;
            
            dummy.position.set(x, y + scaleY / 2, z);
            dummy.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * Math.PI, (Math.random() - 0.5) * 0.3);
            dummy.scale.set(scaleX, scaleY, scaleZ);
            dummy.updateMatrix();
            crystalInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(crystalInst);

        // Deep energy nodes glowing in the sand
        const nodeGeo = new THREE.SphereGeometry(2, 16, 16);
        const nodeInst = new THREE.InstancedMesh(nodeGeo, emissiveBlue, 300);
        for (let i = 0; i < 300; i++) {
            const r = Math.random() * platformRadius;
            const theta = Math.random() * Math.PI * 2;
            dummy.position.set(Math.cos(theta) * r, platformThickness / 2 + 1, Math.sin(theta) * r);
            dummy.scale.set(1, 0.2, 1); // flat glow patches
            dummy.rotation.set(0,0,0);
            dummy.updateMatrix();
            nodeInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(nodeInst);

        // Pulsing animation for nodes
        updatables.push((time, speed) => {
            const pulse = 0.5 + Math.sin(time * 3) * 0.5;
            nodeInst.instanceMatrix.needsUpdate = true; // For complex material updates per instance, we'd need varying attributes, but we can simulate via a global uniform if needed. For now, the emissiveBlue material itself provides a constant intense glow.
        });

        return biomeGroup;
    }

    function buildOceanBiome() {
        const biomeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius, platformRadius, platformThickness, 64), matBiomeBase);
        biomeGroup.add(base);

        // The dynamic ocean surface
        const waterGeo = new THREE.CylinderGeometry(platformRadius - 2, platformRadius - 2, 2, 128, 32);
        const water = new THREE.Mesh(waterGeo, matOcean);
        water.position.y = platformThickness / 2 + 15; // deep water
        biomeGroup.add(water);

        const waterPos = waterGeo.attributes.position;
        const origY = [];
        for (let i = 0; i < waterPos.count; i++) {
            origY.push(waterPos.getY(i));
        }

        updatables.push((time, speed) => {
            for (let i = 0; i < waterPos.count; i++) {
                const x = waterPos.getX(i);
                const z = waterPos.getZ(i);
                const y = origY[i];
                if (y > 0) {
                    const wave1 = Math.sin(x * 0.05 + time * 1.5) * 2;
                    const wave2 = Math.cos(z * 0.08 + time * 1.2) * 2;
                    const wave3 = Math.sin((x + z) * 0.1 + time * 2.0) * 1;
                    waterPos.setY(i, y + wave1 + wave2 + wave3);
                }
            }
            waterPos.needsUpdate = true;
            waterGeo.computeVertexNormals();
        });

        // Submarine Coral Structures (Procedural Torus knots)
        const coralGeo = new THREE.TorusKnotGeometry(4, 1.5, 64, 16, 2, 3);
        const coralInst = new THREE.InstancedMesh(coralGeo, matRedJungle, 400);
        const dummy = new THREE.Object3D();
        for (let i = 0; i < 400; i++) {
            const r = Math.random() * (platformRadius - 20);
            const theta = Math.random() * Math.PI * 2;
            const scale = 0.5 + Math.random() * 2;
            dummy.position.set(Math.cos(theta)*r, platformThickness/2 + scale*4, Math.sin(theta)*r);
            dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            coralInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(coralInst);

        // Bioluminescent Swarms
        const fishCount = 1500;
        const fishGeo = new THREE.ConeGeometry(0.4, 2, 4);
        fishGeo.rotateX(Math.PI / 2);
        const fishInst = new THREE.InstancedMesh(fishGeo, emissiveBlue, fishCount);
        const fishData = [];
        for (let i = 0; i < fishCount; i++) {
            fishData.push({
                x: (Math.random() - 0.5) * 200,
                y: platformThickness/2 + 2 + Math.random() * 10,
                z: (Math.random() - 0.5) * 200,
                speed: 0.5 + Math.random() * 1.5,
                angle: Math.random() * Math.PI * 2,
                pitch: 0,
                turnSpeed: (Math.random() - 0.5) * 0.1
            });
        }
        biomeGroup.add(fishInst);

        updatables.push((time, speed) => {
            fishData.forEach((f, i) => {
                const dist = Math.sqrt(f.x*f.x + f.z*f.z);
                if (dist > platformRadius - 10) {
                    f.angle += 0.1 * speed; // steer away from edge
                } else {
                    f.angle += f.turnSpeed * speed;
                }
                
                f.x += Math.cos(f.angle) * f.speed * speed;
                f.z += Math.sin(f.angle) * f.speed * speed;
                f.y = platformThickness/2 + 7 + Math.sin(time * 2 + i) * 5;

                dummy.position.set(f.x, f.y, f.z);
                dummy.rotation.set(0, -f.angle, 0);
                dummy.updateMatrix();
                fishInst.setMatrixAt(i, dummy.matrix);
            });
            fishInst.instanceMatrix.needsUpdate = true;
        });

        return biomeGroup;
    }

    function buildFrozenTundra() {
        const biomeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius, platformRadius, platformThickness, 64), matBiomeBase);
        biomeGroup.add(base);

        const snowBase = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius-1, platformRadius-1, platformThickness+2, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
        biomeGroup.add(snowBase);

        // Giant Ice Spikes
        const spikeGeo = new THREE.ConeGeometry(3, 10, 5);
        spikeGeo.translate(0, 5, 0);
        const spikeCount = 4000;
        const spikeInst = new THREE.InstancedMesh(spikeGeo, matIce, spikeCount);
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < spikeCount; i++) {
            const r = Math.random() * (platformRadius - 5);
            const theta = Math.random() * Math.PI * 2;
            const scaleY = 2 + Math.random() * 8;
            const scaleXZ = 0.5 + Math.random() * 2;
            
            dummy.position.set(Math.cos(theta)*r, platformThickness/2, Math.sin(theta)*r);
            dummy.rotation.set((Math.random()-0.5)*0.2, Math.random()*Math.PI, (Math.random()-0.5)*0.2);
            dummy.scale.set(scaleXZ, scaleY, scaleXZ);
            dummy.updateMatrix();
            spikeInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(spikeInst);

        // Aurora Borealis Effect
        const auroraGeo = new THREE.PlaneGeometry(platformRadius * 1.5, 80, 32, 8);
        const auroraMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
        const auroraMesh = new THREE.Mesh(auroraGeo, auroraMat);
        auroraMesh.position.y = 80;
        biomeGroup.add(auroraMesh);
        
        const aurPos = auroraGeo.attributes.position;
        const aurOrigX = [];
        const aurOrigY = [];
        for (let i = 0; i < aurPos.count; i++) {
            aurOrigX.push(aurPos.getX(i));
            aurOrigY.push(aurPos.getY(i));
        }

        updatables.push((time, speed) => {
            for (let i = 0; i < aurPos.count; i++) {
                const x = aurOrigX[i];
                const y = aurOrigY[i];
                const waveX = Math.sin(y * 0.05 + time) * 15;
                const waveZ = Math.cos(x * 0.05 + time * 0.5) * 20;
                aurPos.setX(i, x + waveX);
                aurPos.setZ(i, waveZ);
            }
            aurPos.needsUpdate = true;
        });

        // Falling Snow
        const snowGeo = new THREE.SphereGeometry(0.3, 4, 4);
        const snowInst = new THREE.InstancedMesh(snowGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), 2000);
        const snowData = [];
        for (let i = 0; i < 2000; i++) {
            snowData.push({
                x: (Math.random() - 0.5) * platformRadius * 2,
                y: Math.random() * 120,
                z: (Math.random() - 0.5) * platformRadius * 2,
                speedY: 0.5 + Math.random(),
                windOff: Math.random() * Math.PI * 2
            });
        }
        biomeGroup.add(snowInst);

        updatables.push((time, speed) => {
            snowData.forEach((sn, i) => {
                sn.y -= sn.speedY * speed;
                sn.x += Math.sin(time * 2 + sn.windOff) * 0.5 * speed;
                sn.z += Math.cos(time * 1.5 + sn.windOff) * 0.5 * speed;
                
                if (sn.y < platformThickness/2) sn.y = 120;
                
                // clip to cylinder
                const r = Math.sqrt(sn.x*sn.x + sn.z*sn.z);
                if (r > platformRadius) {
                    sn.x = 0;
                    sn.z = 0;
                    sn.y = 120;
                }

                dummy.position.set(sn.x, sn.y, sn.z);
                dummy.updateMatrix();
                snowInst.setMatrixAt(i, dummy.matrix);
            });
            snowInst.instanceMatrix.needsUpdate = true;
        });

        return biomeGroup;
    }

    function buildFungalSwamp() {
        const biomeGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(platformRadius, platformRadius, platformThickness, 64), matBiomeBase);
        biomeGroup.add(base);

        // Acidic Swamp Water
        const swampGeo = new THREE.CylinderGeometry(platformRadius - 1, platformRadius - 1, 1, 64);
        const swamp = new THREE.Mesh(swampGeo, emissiveGreen);
        swamp.position.y = platformThickness / 2 + 0.5;
        biomeGroup.add(swamp);

        // Giant Mushrooms
        const shroomCount = 2500;
        const stemGeo = new THREE.CylinderGeometry(1, 2, 20, 8);
        stemGeo.translate(0, 10, 0);
        const capGeo = new THREE.SphereGeometry(6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 1.5);
        
        const stemInst = new THREE.InstancedMesh(stemGeo, matBiomeBase, shroomCount);
        const capInst = new THREE.InstancedMesh(capGeo, matFungal, shroomCount);
        const dummy = new THREE.Object3D();

        for (let i = 0; i < shroomCount; i++) {
            const r = Math.random() * (platformRadius - 10);
            const theta = Math.random() * Math.PI * 2;
            const scale = 0.5 + Math.random() * 2.5;
            
            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;
            const y = platformThickness / 2;

            dummy.position.set(x, y, z);
            dummy.rotation.set((Math.random()-0.5)*0.3, Math.random()*Math.PI, (Math.random()-0.5)*0.3);
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            stemInst.setMatrixAt(i, dummy.matrix);

            // Cap positioning
            const capY = y + 20 * scale * Math.cos(dummy.rotation.x);
            const capX = x + 20 * scale * Math.sin(dummy.rotation.z);
            const capZ = z - 20 * scale * Math.sin(dummy.rotation.x);

            dummy.position.set(capX, capY, capZ);
            dummy.rotation.x = dummy.rotation.x; // align with stem
            dummy.rotation.z = dummy.rotation.z;
            dummy.scale.set(scale, scale * 0.5, scale); // flatten cap
            dummy.updateMatrix();
            capInst.setMatrixAt(i, dummy.matrix);
        }
        biomeGroup.add(stemInst);
        biomeGroup.add(capInst);

        // Noxious Gas Clouds
        const gasGeo = new THREE.SphereGeometry(15, 16, 16);
        const gasMat = new THREE.MeshBasicMaterial({ color: 0x00ff22, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
        const gasInst = new THREE.InstancedMesh(gasGeo, gasMat, 100);
        const gasData = [];
        for (let i = 0; i < 100; i++) {
            const r = Math.random() * platformRadius;
            const theta = Math.random() * Math.PI * 2;
            gasData.push({
                x: Math.cos(theta) * r,
                y: platformThickness/2 + Math.random() * 40,
                z: Math.sin(theta) * r,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random()
            });
        }
        biomeGroup.add(gasInst);

        updatables.push((time, speed) => {
            gasData.forEach((g, i) => {
                const scale = 1.0 + Math.sin(time * g.speed + g.phase) * 0.3;
                g.x += Math.cos(time * 0.5 + g.phase) * 0.1 * speed;
                g.z += Math.sin(time * 0.5 + g.phase) * 0.1 * speed;
                
                dummy.position.set(g.x, g.y, g.z);
                dummy.scale.set(scale, scale * 0.5, scale);
                dummy.rotation.set(0, time * 0.2, 0);
                dummy.updateMatrix();
                gasInst.setMatrixAt(i, dummy.matrix);
            });
            gasInst.instanceMatrix.needsUpdate = true;
        });

        return biomeGroup;
    }

    // ==========================================
    // MOTHERSHIP CORE STRUCTURES
    // ==========================================

    function buildCentralSpine() {
        const spineGroup = new THREE.Group();
        
        // Procedurally generated highly complex hull profile using LatheGeometry
        const spinePoints = [];
        const hullSegments = 300;
        for (let i = 0; i <= hullSegments; i++) {
            const t = i / hullSegments;
            const z = -1000 + t * 2000;
            let r = 20;
            
            // Equation mapping out the entire 2km mothership hull profile
            if (t < 0.05) r = t * 1600; // Prow cone
            else if (t < 0.1) r = 80 + Math.sin((t-0.05)*20 * Math.PI) * 15; // Sensor baffles
            else if (t < 0.2) r = 60; // Docking trench
            else if (t < 0.4) r = 70 + Math.sin(t * 150) * 4 + Math.cos(t * 80) * 8; // Crew & cargo modules
            else if (t < 0.45) r = 120; // Forward reactor bulge
            else if (t < 0.6) r = 40 + Math.sin(t * 120) * 5; // Central spine neck
            else if (t < 0.75) r = 150 + Math.sin((t-0.6)*10 * Math.PI) * 20; // Gravity Ring Hub Housing
            else if (t < 0.9) r = 80 - (t-0.75)*100 + Math.sin(t*200)*3; // Tapering engineering decks
            else r = 40; // Engine nozzle mount

            // Add massive macro-armor ribs
            if (i % 25 === 0 && t > 0.1 && t < 0.9) r += 25; 
            if (i % 60 === 0 && t > 0.2 && t < 0.8) r += 40; // Weapon / Comm platforms

            spinePoints.push(new THREE.Vector2(r, z));
        }
        
        const spineGeo = new THREE.LatheGeometry(spinePoints, 64);
        const spineMesh = new THREE.Mesh(spineGeo, darkSteel);
        spineMesh.rotation.x = Math.PI / 2; // Align along Z axis
        spineGroup.add(spineMesh);

        // Add 6 longitudinal glowing energy conduits along the spine
        const conduitGeo = new THREE.CylinderGeometry(5, 5, 1800, 16);
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const conduit = new THREE.Mesh(conduitGeo, emissiveBlue);
            conduit.position.set(Math.cos(angle)*75, Math.sin(angle)*75, 0);
            conduit.rotation.x = Math.PI / 2;
            spineGroup.add(conduit);
        }

        return spineGroup;
    }

    function buildMainEngines() {
        const engineGroup = new THREE.Group();
        
        // Primary Fusion Bell
        const nozzleGeo = new THREE.CylinderGeometry(150, 40, 300, 64, 1, true);
        const nozzle = new THREE.Mesh(nozzleGeo, steel);
        nozzle.position.z = -1150;
        nozzle.rotation.x = Math.PI / 2;
        engineGroup.add(nozzle);

        // Inner Magnetic Containment Rings
        for(let i=0; i<10; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(45 + i*10, 4, 16, 64), emissiveBlue);
            ring.position.z = -1020 - i*28;
            engineGroup.add(ring);
        }
        
        // Secondary Sub-light Thrusters (6 around main)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const subNozzle = new THREE.Mesh(new THREE.CylinderGeometry(40, 15, 150, 32, 1, true), darkSteel);
            subNozzle.position.set(Math.cos(angle)*180, Math.sin(angle)*180, -1075);
            subNozzle.rotation.x = Math.PI / 2;
            engineGroup.add(subNozzle);

            // Sub-plume
            const subPlume = new THREE.Mesh(new THREE.ConeGeometry(38, 300, 32), matEnginePlume);
            subPlume.position.set(Math.cos(angle)*180, Math.sin(angle)*180, -1300);
            subPlume.rotation.x = -Math.PI / 2;
            engineGroup.add(subPlume);
            
            updatables.push((time) => {
                const pScale = 1.0 + Math.sin(time * 20 + i) * 0.1;
                subPlume.scale.set(pScale, pScale, pScale);
            });
        }

        // Main Fusion Exhaust Plume
        const mainPlume = new THREE.Mesh(new THREE.ConeGeometry(145, 800, 64), matEnginePlume);
        mainPlume.position.z = -1700;
        mainPlume.rotation.x = -Math.PI / 2;
        engineGroup.add(mainPlume);

        updatables.push((time) => {
            const scale = 1.0 + Math.random() * 0.05 + Math.sin(time * 30) * 0.05;
            mainPlume.scale.set(scale, scale, scale);
            mainPlume.material.opacity = 0.5 + Math.random() * 0.2;
        });

        // Massive Radiator Fins for heat dissipation
        const finGeo = new THREE.BoxGeometry(20, 400, 300);
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const fin = new THREE.Mesh(finGeo, steel);
            fin.position.set(Math.cos(angle)*250, Math.sin(angle)*250, -800);
            fin.rotation.z = angle;
            
            // Heat glow on fins
            const heatGeo = new THREE.BoxGeometry(22, 380, 280);
            const heat = new THREE.Mesh(heatGeo, emissiveRed);
            heat.position.copy(fin.position);
            heat.rotation.z = angle;
            heat.material.transparent = true;
            
            engineGroup.add(fin);
            engineGroup.add(heat);

            updatables.push((time) => {
                heat.material.opacity = 0.3 + Math.sin(time * 5 + i) * 0.2;
            });
        }

        return engineGroup;
    }

    function buildDeflectorShield() {
        const shieldGeo = new THREE.SphereGeometry(1200, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.8);
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.rotation.x = Math.PI / 2; // Face forward
        shield.position.z = 200;
        
        updatables.push((time) => {
            shield.rotation.y = time * 0.05;
            shield.scale.setScalar(1.0 + Math.sin(time * 10) * 0.01);
            shieldMat.opacity = 0.2 + Math.sin(time * 5) * 0.1;
        });
        
        return shield;
    }

    function buildEscortFleet() {
        const fleetGroup = new THREE.Group();
        
        // Command Cruiser
        const cruiserGeo = new THREE.ConeGeometry(20, 100, 16);
        cruiserGeo.rotateX(Math.PI / 2);
        const cruiser = new THREE.Mesh(cruiserGeo, darkSteel);
        cruiser.position.set(0, 400, 500);
        fleetGroup.add(cruiser);

        // Drone Fighters (Instanced)
        const fighterCount = 100;
        const fighterGeo = new THREE.ConeGeometry(4, 20, 8);
        fighterGeo.rotateX(Math.PI / 2);
        const fighterInst = new THREE.InstancedMesh(fighterGeo, steel, fighterCount);
        
        const fighterData = [];
        for (let i = 0; i < fighterCount; i++) {
            fighterData.push({
                radius: 400 + Math.random() * 600,
                angle: Math.random() * Math.PI * 2,
                z: (Math.random() - 0.5) * 2000,
                speed: 0.5 + Math.random() * 1.5,
                wobbleSpeed: Math.random() * 5,
                wobbleMag: Math.random() * 20
            });
        }
        fleetGroup.add(fighterInst);

        const dummy = new THREE.Object3D();
        updatables.push((time, speed) => {
            // Animate Cruiser
            cruiser.position.x = Math.sin(time * 0.2) * 200;
            cruiser.position.y = 400 + Math.cos(time * 0.15) * 100;
            cruiser.rotation.z = Math.sin(time * 0.2) * 0.2; // Banking
            
            // Animate Fighters in orbit
            fighterData.forEach((f, i) => {
                f.angle += (f.speed * 0.01) * speed;
                const r = f.radius + Math.sin(time * f.wobbleSpeed) * f.wobbleMag;
                const x = Math.cos(f.angle) * r;
                const y = Math.sin(f.angle) * r;
                
                const targetX = Math.cos(f.angle + 0.1) * r;
                const targetY = Math.sin(f.angle + 0.1) * r;
                
                dummy.position.set(x, y, f.z);
                dummy.lookAt(targetX, targetY, f.z); // Face travel direction
                dummy.updateMatrix();
                fighterInst.setMatrixAt(i, dummy.matrix);
            });
            fighterInst.instanceMatrix.needsUpdate = true;
        });

        return fleetGroup;
    }

    // ==========================================
    // ASSEMBLY OF THE GOD TIER ARK
    // ==========================================

    const mothership = new THREE.Group();

    // 1. Central Spine
    const spine = buildCentralSpine();
    mothership.add(spine);

    // 2. Main Engines
    const engines = buildMainEngines();
    mothership.add(engines);

    // 3. Asteroid Deflector
    const deflector = buildDeflectorShield();
    mothership.add(deflector);

    // 4. The Massive Gravity Ring containing the 5 Biomes
    const gravityRing = new THREE.Group();
    // Position it along the spine
    gravityRing.position.z = 200; 
    
    // Central Hub for the ring
    const hub = new THREE.Mesh(new THREE.TorusGeometry(180, 40, 32, 128), steel);
    gravityRing.add(hub);

    const biomeBuilders = [
        { name: "Red Jungle", builder: buildRedJungle },
        { name: "Crystal Desert", builder: buildCrystalDesert },
        { name: "Ocean", builder: buildOceanBiome },
        { name: "Frozen Tundra", builder: buildFrozenTundra },
        { name: "Fungal Swamp", builder: buildFungalSwamp }
    ];

    const spokeLength = 600;
    
    biomeBuilders.forEach((biome, index) => {
        const angle = (index / 5) * Math.PI * 2;
        
        // 4.a Build Truss Spoke
        const spoke = buildTrussArm(spokeLength, 40, aluminum);
        
        // Align spoke radially outward
        // The buildTrussArm creates arm along Y axis. 
        spoke.rotation.z = angle - Math.PI / 2;
        // Position base of spoke at hub
        spoke.position.set(Math.cos(angle)*180, Math.sin(angle)*180, 0);
        
        gravityRing.add(spoke);

        // 4.b Build Dome and Biome
        const domeAssembly = new THREE.Group();
        // Distance from center = hub radius + spoke length + dome radius
        const distance = 180 + spokeLength + domeRadius; 
        domeAssembly.position.set(Math.cos(angle)*distance, Math.sin(angle)*distance, 0);
        
        // Physics logic: In a rotating ring, centrifugal gravity pushes outward.
        // Therefore, "down" (floor of the biome) must point radially OUTWARD.
        // The biome platform is built along the Y axis. 
        // We rotate the assembly so the platform's Y-axis points towards the center of rotation (0,0,0).
        domeAssembly.rotation.z = angle + Math.PI / 2;

        const domeShell = createDomeShell();
        const biomeContent = biome.builder();
        
        domeAssembly.add(domeShell);
        domeAssembly.add(biomeContent);
        
        gravityRing.add(domeAssembly);
    });

    mothership.add(gravityRing);

    // Rotate gravity ring for artificial gravity
    updatables.push((time, speed) => {
        // 1 RPM for a massive ship is incredibly fast visually, so we use a slow majestic rotation
        gravityRing.rotation.z = time * 0.05 * speed;
    });

    // 5. Escort Fleet
    const fleet = buildEscortFleet();
    mothership.add(fleet);

    group.add(mothership);

    // ==========================================
    // PARTS REGISTRATION (EXTREME METADATA)
    // ==========================================

    parts.push({
        name: 'Mothership Central Spine',
        description: 'The 2-kilometer long structural core of the Generational Ark. Forged from hyper-dense neutronium-infused steel, it houses the primary data banks, hyperdrive core, and the central mag-lev elevators.',
        material: 'darkSteel, chrome, emissiveBlue',
        function: 'Maintains absolute structural integrity and serves as the central power distribution conduit.',
        assemblyOrder: 1,
        connections: ['Gravity Ring Central Hub', 'Main Engine Bank', 'Asteroid Deflector Shield'],
        failureEffect: 'Catastrophic shearing under thrust, snapping the ship into multiple uninhabitable, unpowered fragments.',
        cascadeFailures: ['Complete Power Loss', 'Atmospheric Venting', 'Immediate Fleet Destruction'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: 'Gravity Ring Central Hub',
        description: 'A colossal 360-meter rotating magnetic bearing that bridges the static central spine and the rotating biome ring. Utilizes frictionless diamagnetic levitation to prevent wear over millennia.',
        material: 'steel, emissiveBlue',
        function: 'Transfers fusion power to the biomes while allowing independent rotation to generate 1.0G of centrifugal artificial gravity.',
        assemblyOrder: 2,
        connections: ['Mothership Central Spine', 'Truss Spokes (Alpha through Epsilon)'],
        failureEffect: 'Seizing of the magnetic bearing, causing immense immediate torsional stress that would rip the spine apart.',
        cascadeFailures: ['Total Gravity Loss in Biomes', 'Spine Torsional Fracture', 'Flora Uprooting'],
        originalPosition: { x: 0, y: 0, z: 200 },
        explodedPosition: { x: 0, y: 0, z: 1200 }
    });

    parts.push({
        name: 'Primary Fusion Sub-light Engine',
        description: 'A stellarator-class continuous fusion reactor maintaining a 15 million Kelvin plasma core, expelled out the aft nozzle at 0.1c to propel the Ark.',
        material: 'steel, matEnginePlume',
        function: 'Provides the massive sustained thrust required for interstellar transit.',
        assemblyOrder: 3,
        connections: ['Mothership Central Spine', 'Secondary Thruster Banks', 'Radiator Fin Array'],
        failureEffect: 'Magnetic containment loss leading to immediate structural vaporization of the aft section.',
        cascadeFailures: ['Ship Vaporization', 'Shield Collapse'],
        originalPosition: { x: 0, y: 0, z: -1150 },
        explodedPosition: { x: 0, y: -1000, z: -1500 }
    });

    parts.push({
        name: 'Multi-phasic Asteroid Deflector',
        description: 'A pulsing spherical electromagnetic field generator designed to vaporize micrometeoroids and gently deflect larger astroidal bodies travelling at relativistic speeds.',
        material: 'shieldMat',
        function: 'Protects the fragile transparent domes and hull from kinetic impacts in deep space.',
        assemblyOrder: 4,
        connections: ['Mothership Central Spine'],
        failureEffect: 'Kinetic bombardment destroys the biosphere glass, exposing the biomes to the vacuum of space.',
        cascadeFailures: ['Dome Depressurization', 'Extinction Event'],
        originalPosition: { x: 0, y: 0, z: 200 },
        explodedPosition: { x: 0, y: 0, z: 2000 }
    });

    parts.push({
        name: 'Radiator Fin Array',
        description: 'Four massive 400m long graphene-composite fins designed to radiate the extreme heat of the fusion drive into the vacuum of space.',
        material: 'steel, emissiveRed',
        function: 'Thermal regulation and heat dissipation for the reactor and life support systems.',
        assemblyOrder: 5,
        connections: ['Primary Fusion Sub-light Engine'],
        failureEffect: 'Thermal runaway causing the fusion core to melt through its housing.',
        cascadeFailures: ['Reactor Meltdown', 'Life Support Boiling'],
        originalPosition: { x: 0, y: 0, z: -800 },
        explodedPosition: { x: 1000, y: 0, z: -800 }
    });

    biomeBuilders.forEach((biome, index) => {
        parts.push({
            name: `${biome.name} Biosphere Dome`,
            description: `A 320m diameter Icosahedron glass dome enclosing the ${biome.name} biome. Constructed from a transparent aluminum-silicate alloy capable of withstanding 5 ATM of internal pressure and direct micrometeoroid strikes.`,
            material: 'transparentDome, matBiomeBase',
            function: `Provides a hermetically sealed, climatically controlled environment preserving the genetics of the ${biome.name} ecosystem.`,
            assemblyOrder: 10 + index,
            connections: [`Truss Spoke ${index+1}`, 'Atmospheric Scrubbers', 'Nutrient Feed Lines'],
            failureEffect: 'Explosive decompression causing immediate freezing and death of all contained flora and fauna.',
            cascadeFailures: ['Ecosystem Collapse', 'Species Extinction'],
            originalPosition: { x: Math.cos((index/5)*Math.PI*2)*940, y: Math.sin((index/5)*Math.PI*2)*940, z: 200 },
            explodedPosition: { x: Math.cos((index/5)*Math.PI*2)*2000, y: Math.sin((index/5)*Math.PI*2)*2000, z: 200 }
        });

        parts.push({
            name: `Truss Spoke ${index+1}`,
            description: `A 600m long reinforced titanium truss arm connecting the central hub to the ${biome.name} dome. Contains high-capacity elevators, power conduits, and water mains.`,
            material: 'aluminum',
            function: 'Structural support and transit artery for the biome.',
            assemblyOrder: 5 + index,
            connections: ['Gravity Ring Central Hub', `${biome.name} Biosphere Dome`],
            failureEffect: 'Snapping of the arm due to centripetal forces, launching the dome into deep space.',
            cascadeFailures: ['Dome Loss', 'Severe Gyroscopic Imbalance of Mothership'],
            originalPosition: { x: Math.cos((index/5)*Math.PI*2)*480, y: Math.sin((index/5)*Math.PI*2)*480, z: 200 },
            explodedPosition: { x: Math.cos((index/5)*Math.PI*2)*1000, y: Math.sin((index/5)*Math.PI*2)*1000, z: 200 }
        });
    });

    parts.push({
        name: 'Escort Fleet Command Cruiser',
        description: 'An autonomous, heavily armored frigate running advanced predictive AI to orchestrate the drone swarm and protect the Ark from anomalous spatial threats.',
        material: 'darkSteel',
        function: 'Tactical defense coordination and deep-space pathfinding.',
        assemblyOrder: 20,
        connections: ['Autonomous Drone Swarm'],
        failureEffect: 'Loss of cohesive defensive formations, leaving the Ark vulnerable to targeted debris or hostile entities.',
        cascadeFailures: ['Drone Scatter', 'Shield Overwhelm'],
        originalPosition: { x: 0, y: 400, z: 500 },
        explodedPosition: { x: 0, y: 1500, z: 1500 }
    });

    parts.push({
        name: 'Secondary Thruster Banks',
        description: 'A ring of 6 auxiliary fusion drives utilized for intricate vectoring, pitch/yaw maneuvers, and emergency braking.',
        material: 'darkSteel, matEnginePlume',
        function: 'Provides precise navigation and attitude control for the continent-sized vessel.',
        assemblyOrder: 21,
        connections: ['Primary Fusion Sub-light Engine', 'Mothership Central Spine'],
        failureEffect: 'Inability to alter course, potentially leading to collision with planetary bodies or nebular hazards.',
        cascadeFailures: ['Navigation Lock', 'Fatal Collision'],
        originalPosition: { x: 0, y: 0, z: -1075 },
        explodedPosition: { x: 0, y: 0, z: -2000 }
    });

    // ==========================================
    // EXTREME PhD-LEVEL QUIZ QUESTIONS
    // ==========================================

    const quizQuestions = [
        {
            question: "In the event of a catastrophic failure in the closed-loop ecological life support system (CELSS) of the Fungal Swamp biome, causing an unmitigated spike in ambient CO2 and localized acidification of the nutrient medium, what is the exact sequence of homeostatic restorative measures required to prevent complete biomass collapse without disrupting adjacent biomes?",
            options: [
                "Increase LED illumination by 400% to stimulate remaining photosynthesis, introduce basic buffers via aerial drones, and activate emergency venting into the vacuum of space.",
                "Introduce genetically engineered methanogens to consume excess CO2, artificially increase ambient temperature by 15°C, and flood the biome with pure O2 from the cryogenic reserves.",
                "Seal the biome's atmospheric exchange valves, implement localized cryogenic freezing of the primary fungal spore producers, and allow the mechanical CO2 scrubbers to normalize the atmosphere over a 72-hour cycle.",
                "Inject high-molarity alkalines directly into the water table via the Spoke Truss conduits, rapidly deploy genetically altered cyanobacteria to balance the pH, and initiate atmospheric recalibration by routing excess CO2 into the ship's main fusion core plasma reserve for breakdown."
            ],
            answer: 3
        },
        {
            question: "The sub-light engines rely on a magnetically contained continuous stellarator fusion reaction. If the super-conducting coils experience a microscopic lattice fracture leading to a precise 0.05% fluctuation in the magnetic confinement field, what is the immediate kinetic consequence for the ship's delta-V and structural integrity?",
            options: [
                "A total core breach causing the immediate and complete vaporization of the aft engine section and radiator fins.",
                "Asymmetrical thrust vectoring resulting in a 2.3-degree pitch deviation per second, triggering automatic core dampening protocols and leading to a 40% loss of total thrust capability.",
                "The exhaust plume will thermally expand by 10%, causing minor but acceptable ablation to the radiator fins without affecting overall forward thrust.",
                "No immediate kinetic effect; the secondary diamagnetic containment fields will automatically compensate for field fluctuations up to a 1.0% threshold."
            ],
            answer: 1
        },
        {
            question: "The artificial gravity in the biomes is maintained by the centrifugal force of the massive 940m radius rotating ring. If the ring's angular velocity is increased by 15% to compensate for an influx of mass in the Crystal Desert biome (due to unchecked runaway silicate growth), what is the Coriolis effect delta experienced by a maintenance drone moving radially inward at 5 m/s, and how must the ship's gyro-stabilization counter the resulting torque?",
            options: [
                "A delta of 0.2 m/s², countered by adjusting the counter-rotating habitation toruses embedded in the spine by -4% RPM.",
                "A delta of 1.5 m/s², countered by deploying asymmetric thrust from the port-side secondary navigation thrusters.",
                "A delta of 3.8 m/s², countered by shifting 500,000 metric tons of liquid hydrogen ballast within the primary hull.",
                "A delta of 0.8 m/s², countered by increasing the magnetic bearing viscosity in the central hub."
            ],
            answer: 0
        },
        {
            question: "During interstellar transit through a high-density H II region nebula, the Asteroid Deflector Shield experiences severe continuous particle bombardment. The shield operates on a multi-phasic electromagnetic repulsion principle. To maximize efficiency without exceeding the thermal limits of the primary emitters, what is the optimal phase-modulation strategy?",
            options: [
                "Maintain a static high-frequency phase and route excess heat directly into the Fungal Swamp biome to increase humidity.",
                "Cycle through 12 distinct phase frequencies algorithmically matched to the incoming particle density variance, dissipating the extreme heat through the aft radiator fins.",
                "Pulse the shield at 1Hz, intentionally allowing micro-impacts on the ablative hull armor to absorb kinetic energy and save electrical power.",
                "Focus all shield energy into a narrow 15-degree forward cone, leaving the aft section completely exposed, relying solely on the engine exhaust to vaporize incoming threats."
            ],
            answer: 1
        },
        {
            question: "The Red Jungle biome utilizes a genetically modified flora base that requires a specific spectrum of radiation to photosynthesize effectively, mimicking the light of a Class M red dwarf. If the artificial sun dome emitters degrade and shift the emission spectrum 50nm towards the blue (higher energy), what is the expected ecological cascade, and what engineered biological failsafe is programmed to activate?",
            options: [
                "Rapid uncontrolled overgrowth blocking all light; the failsafe releases engineered herbivorous drone-insects to cull the excess canopy mass.",
                "Immediate cellular necrosis of the primary canopy due to radiation damage; the failsafe triggers the germination of dormant secondary seeds genetically adapted to a broader, higher-energy spectrum.",
                "Stagnation of flora growth; the failsafe increases ambient temperature and humidity to artificially compensate for the lower photosynthetic yield.",
                "The flora begins rapidly producing toxic alkaloid defense mechanisms; the failsafe vents the toxic atmosphere and replaces it with inert nitrogen, essentially hitting an ecological reset."
            ],
            answer: 1
        }
    ];

    const animate = function(time, speed, meshes) {
        updatables.forEach(fn => fn(time, speed));
    };

    return { group, parts, description, quizQuestions, animate };
}
