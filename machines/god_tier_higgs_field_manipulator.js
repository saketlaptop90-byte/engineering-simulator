import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -----------------------------------------------------------------------------------
    // ADVANCED CUSTOM MATERIALS
    // -----------------------------------------------------------------------------------
    const higgsGlowMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.7,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const higgsNodeMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9
    });

    const energyBeamMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const exoticAsteroidMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.9,
        metalness: 0.2,
        emissive: 0x000000,
        emissiveIntensity: 0.0
    });

    const darkMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        emissive: 0x220044,
        emissiveIntensity: 1.0,
        roughness: 0.4,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const plasmaMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff3300,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8
    });

    const laserMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const sensorGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x002244,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
        specularIntensity: 1.0,
        clearcoat: 1.0
    });

    // -----------------------------------------------------------------------------------
    // PROCEDURAL GEOMETRY GENERATORS
    // -----------------------------------------------------------------------------------

    function createBasePlatform() {
        const baseGroup = new THREE.Group();
        
        // Massive hexagonal base
        const hexShape = new THREE.Shape();
        const size = 100;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            if (i === 0) hexShape.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
            else hexShape.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        }
        hexShape.lineTo(Math.cos(0) * size, Math.sin(0) * size);

        const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
        const baseGeo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.rotation.x = Math.PI / 2;
        baseMesh.position.y = -40;
        baseGroup.add(baseMesh);

        // Support trusses and hydraulic pillars
        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * 85;
            const pz = Math.sin(angle) * 85;
            
            // Outer pillar
            const pillarGeo = new THREE.CylinderGeometry(4, 6, 30, 16);
            const pillar = new THREE.Mesh(pillarGeo, steel);
            pillar.position.set(px, -25, pz);
            baseGroup.add(pillar);

            // Hydraulic piston inside pillar
            const pistonGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const piston = new THREE.Mesh(pistonGeo, chrome);
            piston.position.set(px, -10, pz);
            baseGroup.add(piston);

            // Base vents
            const ventGeo = new THREE.BoxGeometry(10, 5, 2);
            const vent = new THREE.Mesh(ventGeo, darkSteel);
            vent.position.set(px, -35, pz);
            vent.lookAt(0, -35, 0);
            baseGroup.add(vent);
        }

        // Inner glowing trench
        const trenchGeo = new THREE.TorusGeometry(40, 2, 16, 64);
        const trench = new THREE.Mesh(trenchGeo, plasmaMat);
        trench.rotation.x = Math.PI / 2;
        trench.position.y = -39;
        baseGroup.add(trench);

        meshes.baseVents = baseGroup.children.filter(c => c.geometry.type === 'BoxGeometry');
        return baseGroup;
    }

    function createContainmentVessel() {
        const vesselGroup = new THREE.Group();

        // Outer glass dome
        const domeGeo = new THREE.SphereGeometry(60, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const dome = new THREE.Mesh(domeGeo, sensorGlassMat);
        dome.position.y = -30;
        vesselGroup.add(dome);

        // Lower steel basin
        const basinGeo = new THREE.SphereGeometry(60, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
        const basin = new THREE.Mesh(basinGeo, steel);
        basin.position.y = -30;
        vesselGroup.add(basin);

        // Structural ribs for the dome
        for(let i=0; i<12; i++) {
            const ribGeo = new THREE.TorusGeometry(60.5, 1, 16, 64, Math.PI);
            const rib = new THREE.Mesh(ribGeo, darkSteel);
            rib.rotation.y = (i / 12) * Math.PI;
            rib.position.y = -30;
            vesselGroup.add(rib);
        }

        return vesselGroup;
    }

    function createToroid(radius, tube, magnetCount, materialType, name) {
        const toroidGroup = new THREE.Group();

        // Main superconducting ring
        const ringGeo = new THREE.TorusGeometry(radius, tube, 32, 128);
        const ring = new THREE.Mesh(ringGeo, materialType);
        toroidGroup.add(ring);

        // Attach magnets and cooling fins along the ring
        meshes[`${name}_magnets`] = [];
        for (let i = 0; i < magnetCount; i++) {
            const angle = (i / magnetCount) * Math.PI * 2;
            
            // Magnet block
            const magGeo = new THREE.BoxGeometry(tube * 2.5, tube * 2.5, tube * 1.5);
            const magnet = new THREE.Mesh(magGeo, steel);
            
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            magnet.position.set(px, py, 0);
            magnet.lookAt(0, 0, 0);
            toroidGroup.add(magnet);
            meshes[`${name}_magnets`].push(magnet);

            // Coil wrapping the magnet
            const coilGeo = new THREE.CylinderGeometry(tube * 1.3, tube * 1.3, tube * 1.6, 16);
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.position.copy(magnet.position);
            coil.rotation.copy(magnet.rotation);
            coil.rotation.x += Math.PI / 2;
            toroidGroup.add(coil);

            // Glowing indicator
            const indGeo = new THREE.SphereGeometry(tube * 0.4, 8, 8);
            const indicator = new THREE.Mesh(indGeo, plasmaMat);
            indicator.position.set(
                Math.cos(angle) * (radius + tube * 1.2),
                Math.sin(angle) * (radius + tube * 1.2),
                0
            );
            toroidGroup.add(indicator);
        }

        return toroidGroup;
    }

    function createQuantumEmitters() {
        const emitterGroup = new THREE.Group();
        meshes.emitters = [];
        
        const emitterCount = 8;
        for (let i = 0; i < emitterCount; i++) {
            const angle = (i / emitterCount) * Math.PI * 2;
            
            const points = [];
            for ( let j = 0; j < 10; j ++ ) {
                points.push( new THREE.Vector2( Math.sin( j * 0.2 ) * 3 + 2, ( j - 5 ) * 2 ) );
            }
            const latheGeo = new THREE.LatheGeometry(points, 32);
            const emitter = new THREE.Mesh(latheGeo, chrome);
            
            const px = Math.cos(angle) * 75;
            const pz = Math.sin(angle) * 75;
            
            emitter.position.set(px, 10, pz);
            emitter.lookAt(0, 10, 0);
            emitter.rotation.x += Math.PI / 2;

            // Emitter nozzle crystal
            const crystalGeo = new THREE.OctahedronGeometry(3, 0);
            const crystal = new THREE.Mesh(crystalGeo, energyBeamMat);
            crystal.position.set(0, 10, 0); // relative to emitter
            emitter.add(crystal);

            // Power couplings
            const couplingGeo = new THREE.TorusGeometry(5, 1, 16, 32);
            const coupling = new THREE.Mesh(couplingGeo, darkSteel);
            coupling.position.set(0, -5, 0);
            coupling.rotation.x = Math.PI / 2;
            emitter.add(coupling);

            emitterGroup.add(emitter);
            meshes.emitters.push(emitter);
        }
        return emitterGroup;
    }

    function createHiggsLattice() {
        const latticeGroup = new THREE.Group();
        const latticeSize = 40;
        const step = 10;
        
        meshes.latticeNodes = [];
        meshes.latticeLines = [];

        // We will create a spherical bounding logic for the grid
        for(let x = -latticeSize; x <= latticeSize; x+=step) {
            for(let y = -latticeSize; y <= latticeSize; y+=step) {
                for(let z = -latticeSize; z <= latticeSize; z+=step) {
                    if (Math.sqrt(x*x + y*y + z*z) <= latticeSize) {
                        const nodeGeo = new THREE.SphereGeometry(0.5, 8, 8);
                        const node = new THREE.Mesh(nodeGeo, higgsNodeMat);
                        node.position.set(x, y + 10, z);
                        latticeGroup.add(node);
                        meshes.latticeNodes.push(node);
                    }
                }
            }
        }

        // Add a giant spherical wireframe envelope
        const envGeo = new THREE.IcosahedronGeometry(latticeSize + 5, 3);
        const envelope = new THREE.Mesh(envGeo, higgsGlowMat);
        envelope.position.y = 10;
        latticeGroup.add(envelope);
        meshes.latticeEnvelope = envelope;

        return latticeGroup;
    }

    function createTargetAsteroid() {
        const asteroidGroup = new THREE.Group();
        
        // Procedurally deformed icosahedron
        const radius = 15;
        const geo = new THREE.IcosahedronGeometry(radius, 6);
        const pos = geo.attributes.position;
        const v = new THREE.Vector3();
        
        const originalVertices = [];
        
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            originalVertices.push(v.clone());
            // Complex noise simulation
            const noise = (Math.sin(v.x * 0.3) * Math.cos(v.y * 0.3) * Math.sin(v.z * 0.3)) * 3.0;
            const noise2 = (Math.sin(v.x * 0.8 + 1.2) * Math.cos(v.y * 0.8 - 0.5)) * 1.5;
            v.addScaledVector(v.clone().normalize(), noise + noise2 + (Math.random() * 0.5));
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        geo.computeVertexNormals();

        const asteroid = new THREE.Mesh(geo, exoticAsteroidMat);
        asteroid.position.y = 10;
        asteroidGroup.add(asteroid);
        
        meshes.asteroid = asteroid;
        meshes.asteroidOriginalVertices = originalVertices;
        meshes.asteroidGeo = geo;

        // Add debris ring around it
        const debrisGroup = new THREE.Group();
        for(let i=0; i<150; i++) {
            const debGeo = new THREE.DodecahedronGeometry(Math.random() * 1.5 + 0.2);
            const deb = new THREE.Mesh(debGeo, exoticAsteroidMat);
            const dAngle = Math.random() * Math.PI * 2;
            const dRad = radius + 5 + Math.random() * 15;
            deb.position.set(
                Math.cos(dAngle) * dRad,
                (Math.random() - 0.5) * 10,
                Math.sin(dAngle) * dRad
            );
            deb.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            debrisGroup.add(deb);
        }
        debrisGroup.position.y = 10;
        asteroidGroup.add(debrisGroup);
        meshes.asteroidDebris = debrisGroup;

        return asteroidGroup;
    }

    function createCoolingTowers() {
        const coolingGroup = new THREE.Group();
        meshes.fans = [];

        for(let i=0; i<4; i++) {
            const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
            const px = Math.cos(angle) * 90;
            const pz = Math.sin(angle) * 90;

            const towerGroup = new THREE.Group();
            
            // Main body
            const bodyGeo = new THREE.CylinderGeometry(8, 10, 40, 16);
            const body = new THREE.Mesh(bodyGeo, steel);
            towerGroup.add(body);

            // Heat fins
            for(let j=0; j<10; j++) {
                const finGeo = new THREE.CylinderGeometry(11, 11, 0.5, 16);
                const fin = new THREE.Mesh(finGeo, aluminum);
                fin.position.y = -15 + j * 3;
                towerGroup.add(fin);
            }

            // Top exhaust fan
            const fanGroup = new THREE.Group();
            const hubGeo = new THREE.CylinderGeometry(2, 2, 2, 16);
            const hub = new THREE.Mesh(hubGeo, darkSteel);
            fanGroup.add(hub);

            for(let b=0; b<6; b++) {
                const bladeGeo = new THREE.BoxGeometry(7, 0.2, 2);
                const blade = new THREE.Mesh(bladeGeo, plastic);
                blade.position.x = 4.5;
                blade.rotation.x = Math.PI / 6;
                const pivot = new THREE.Group();
                pivot.rotation.y = (b / 6) * Math.PI * 2;
                pivot.add(blade);
                fanGroup.add(pivot);
            }
            fanGroup.position.y = 20;
            towerGroup.add(fanGroup);
            meshes.fans.push(fanGroup);

            // Exhaust glow
            const exhaustGeo = new THREE.SphereGeometry(6, 16, 16);
            const exhaust = new THREE.Mesh(exhaustGeo, plasmaMat);
            exhaust.position.y = 22;
            exhaust.scale.y = 2.0;
            towerGroup.add(exhaust);

            towerGroup.position.set(px, -20, pz);
            coolingGroup.add(towerGroup);
        }

        return coolingGroup;
    }

    function createPlasmaConduits() {
        const conduitGroup = new THREE.Group();
        const emitterCount = 8;
        
        for (let i = 0; i < emitterCount; i++) {
            const angle = (i / emitterCount) * Math.PI * 2;
            const endX = Math.cos(angle) * 75;
            const endZ = Math.sin(angle) * 75;
            
            // Complex curved spline from base to emitter
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -35, 0),
                new THREE.Vector3(endX * 0.3, -20, endZ * 0.3),
                new THREE.Vector3(endX * 0.7, -5, endZ * 0.7),
                new THREE.Vector3(endX, 5, endZ)
            ]);

            const tubeGeo = new THREE.TubeGeometry(curve, 32, 2, 12, false);
            const tube = new THREE.Mesh(tubeGeo, glass);
            conduitGroup.add(tube);

            // Inner plasma core
            const coreGeo = new THREE.TubeGeometry(curve, 32, 0.8, 8, false);
            const core = new THREE.Mesh(coreGeo, plasmaMat);
            conduitGroup.add(core);

            // Metal rings around tube
            for(let j=1; j<32; j+=3) {
                const point = curve.getPoint(j / 32);
                const tangent = curve.getTangent(j / 32);
                const ringGeo = new THREE.TorusGeometry(2.5, 0.4, 8, 16);
                const ring = new THREE.Mesh(ringGeo, steel);
                ring.position.copy(point);
                
                // Align ring to tangent
                const axis = new THREE.Vector3(0, 0, 1);
                ring.quaternion.setFromUnitVectors(axis, tangent);
                conduitGroup.add(ring);
            }
        }

        return conduitGroup;
    }

    function createControlNexus() {
        const nexusGroup = new THREE.Group();
        
        // Command Cabin
        const cabinGeo = new THREE.BoxGeometry(20, 15, 25);
        const cabin = new THREE.Mesh(cabinGeo, darkSteel);
        cabin.position.set(110, -10, 0);
        nexusGroup.add(cabin);

        // Tinted Observation Window
        const windowGeo = new THREE.BoxGeometry(2, 10, 20);
        const cabinWindow = new THREE.Mesh(windowGeo, tinted);
        cabinWindow.position.set(100, -10, 0);
        nexusGroup.add(cabinWindow);

        // Radar dish on top
        const dishGroup = new THREE.Group();
        const dishGeo = new THREE.CylinderGeometry(8, 0, 4, 32, 1, true);
        const dish = new THREE.Mesh(dishGeo, aluminum);
        dish.position.y = 2;
        dishGroup.add(dish);
        
        const antennaGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
        const antenna = new THREE.Mesh(antennaGeo, chrome);
        antenna.position.y = 4;
        dishGroup.add(antenna);

        dishGroup.position.set(110, -2, 0);
        dishGroup.rotation.x = -Math.PI / 4;
        nexusGroup.add(dishGroup);
        meshes.radarDish = dishGroup;

        // Access catwalk
        const walkGeo = new THREE.BoxGeometry(30, 2, 10);
        const walk = new THREE.Mesh(walkGeo, steel);
        walk.position.set(85, -15, 0);
        nexusGroup.add(walk);

        // Glowing control panels inside (visible through window if rendered right)
        const panelGeo = new THREE.BoxGeometry(1, 5, 15);
        const panelMat = new THREE.MeshStandardMaterial({color: 0x002200, emissive: 0x00ff00, emissiveIntensity: 0.5});
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(102, -12, 0);
        nexusGroup.add(panel);

        return nexusGroup;
    }

    function createGravimetricSensors() {
        const sensorGroup = new THREE.Group();
        meshes.sensors = [];

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * 65;
            const pz = Math.sin(angle) * 65;

            const sGroup = new THREE.Group();
            
            // Sensor body
            const bodyGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
            const body = new THREE.Mesh(bodyGeo, chrome);
            sGroup.add(body);

            // Spinning internal array
            const arrayGeo = new THREE.TorusGeometry(3, 0.5, 8, 16);
            const array = new THREE.Mesh(arrayGeo, copper);
            array.rotation.x = Math.PI / 2;
            sGroup.add(array);
            
            const coreGeo = new THREE.SphereGeometry(1.5, 16, 16);
            const core = new THREE.Mesh(coreGeo, laserMat);
            sGroup.add(core);

            sGroup.position.set(px, 30, pz);
            // Look towards center
            sGroup.lookAt(0, 10, 0);
            
            sensorGroup.add(sGroup);
            meshes.sensors.push({group: sGroup, array: array, core: core});
        }
        return sensorGroup;
    }

    function createEnergyShieldGenerators() {
        const shieldGroup = new THREE.Group();
        meshes.shieldPillars = [];

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + (Math.PI / 12);
            const px = Math.cos(angle) * 105;
            const pz = Math.sin(angle) * 105;

            const pillarGeo = new THREE.CylinderGeometry(2, 4, 25, 16);
            const pillar = new THREE.Mesh(pillarGeo, darkSteel);
            pillar.position.set(px, -20, pz);
            shieldGroup.add(pillar);

            const nodeGeo = new THREE.IcosahedronGeometry(3, 1);
            const node = new THREE.Mesh(nodeGeo, higgsGlowMat);
            node.position.set(px, -5, pz);
            shieldGroup.add(node);
            
            meshes.shieldPillars.push(node);
        }

        // Invisible spherical shield bounds
        const boundsGeo = new THREE.SphereGeometry(120, 64, 64);
        const boundsMat = new THREE.MeshPhysicalMaterial({
            color: 0x00ffff,
            transmission: 0.95,
            opacity: 1,
            metalness: 0.1,
            roughness: 0,
            ior: 1.2,
            thickness: 1.0,
            transparent: true,
            side: THREE.BackSide,
            envMapIntensity: 2.0,
            emissive: 0x001133
        });
        const bounds = new THREE.Mesh(boundsGeo, boundsMat);
        bounds.position.y = 10;
        shieldGroup.add(bounds);
        meshes.energyShield = bounds;

        return shieldGroup;
    }

    function createFluxCapacitors() {
        const fluxGroup = new THREE.Group();
        meshes.capacitors = [];

        for (let i=0; i<3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const px = Math.cos(angle) * 45;
            const pz = Math.sin(angle) * 45;

            const capGroup = new THREE.Group();

            // Main cylinder
            const cylGeo = new THREE.CylinderGeometry(6, 6, 20, 32);
            const cyl = new THREE.Mesh(cylGeo, copper);
            capGroup.add(cyl);

            // Glass casing
            const casingGeo = new THREE.CylinderGeometry(7, 7, 22, 32);
            const casing = new THREE.Mesh(casingGeo, sensorGlassMat);
            capGroup.add(casing);

            // Energy bolts inside
            const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 18, 8);
            for(let j=0; j<5; j++) {
                const bolt = new THREE.Mesh(boltGeo, higgsGlowMat);
                bolt.position.set(
                    (Math.random()-0.5)*8,
                    0,
                    (Math.random()-0.5)*8
                );
                bolt.rotation.set(Math.random()*0.2, 0, Math.random()*0.2);
                capGroup.add(bolt);
            }

            capGroup.position.set(px, -25, pz);
            fluxGroup.add(capGroup);
            meshes.capacitors.push(capGroup);
        }

        return fluxGroup;
    }

    function createDarkMatterCore() {
        const coreGroup = new THREE.Group();
        
        // Massive dense sphere at the bottom
        const sphereGeo = new THREE.SphereGeometry(15, 64, 64);
        const sphere = new THREE.Mesh(sphereGeo, darkMatterMat);
        sphere.position.y = -50;
        coreGroup.add(sphere);

        // Floating rings around the core
        meshes.coreRings = [];
        for(let i=0; i<3; i++) {
            const ringGeo = new THREE.TorusGeometry(20 + i*4, 1, 16, 64);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.position.y = -50;
            ring.rotation.x = Math.PI / 2 + (Math.random() * 0.5);
            ring.rotation.y = Math.random() * Math.PI;
            coreGroup.add(ring);
            meshes.coreRings.push(ring);
        }

        return coreGroup;
    }

    function createParticleBeams() {
        const beamGroup = new THREE.Group();
        meshes.beams = [];

        const emitterCount = 8;
        for (let i = 0; i < emitterCount; i++) {
            const angle = (i / emitterCount) * Math.PI * 2;
            const startX = Math.cos(angle) * 75;
            const startZ = Math.sin(angle) * 75;

            // Distance from emitter to center asteroid
            const startVec = new THREE.Vector3(startX, 10, startZ);
            const endVec = new THREE.Vector3(0, 10, 0);
            const distance = startVec.distanceTo(endVec);

            const beamGeo = new THREE.CylinderGeometry(1, 1, distance, 16, 1, true);
            const beam = new THREE.Mesh(beamGeo, energyBeamMat);
            
            // Position halfway
            beam.position.copy(startVec).lerp(endVec, 0.5);
            beam.lookAt(endVec);
            beam.rotation.x += Math.PI / 2;

            beamGroup.add(beam);
            meshes.beams.push(beam);
        }

        return beamGroup;
    }

    function createVacuumSeals() {
        const sealGroup = new THREE.Group();
        // Adds heavy mechanical detail where containment vessel meets base
        for(let i=0; i<24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const px = Math.cos(angle) * 60;
            const pz = Math.sin(angle) * 60;

            const clampGeo = new THREE.BoxGeometry(8, 12, 6);
            const clamp = new THREE.Mesh(clampGeo, steel);
            clamp.position.set(px, -30, pz);
            clamp.lookAt(0, -30, 0);

            // Rubber gasket visible
            const gasketGeo = new THREE.BoxGeometry(10, 2, 4);
            const gasket = new THREE.Mesh(gasketGeo, rubber);
            gasket.position.set(0, 0, -2);
            clamp.add(gasket);

            sealGroup.add(clamp);
        }
        return sealGroup;
    }

    function createHydraulicDampers() {
        const damperGroup = new THREE.Group();
        // Dampers holding the inner toroids
        for(let i=0; i<4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const armGroup = new THREE.Group();

            const armGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const arm = new THREE.Mesh(armGeo, chrome);
            arm.rotation.z = Math.PI / 4;
            arm.position.set(15, 15, 0);
            armGroup.add(arm);

            const jointGeo = new THREE.SphereGeometry(4, 16, 16);
            const joint = new THREE.Mesh(jointGeo, darkSteel);
            joint.position.set(30, 30, 0);
            armGroup.add(joint);

            armGroup.rotation.y = angle;
            armGroup.position.y = -10;
            damperGroup.add(armGroup);
        }
        return damperGroup;
    }

    function createDiagnosticLasers() {
        const laserGroup = new THREE.Group();
        meshes.lasers = [];

        // Thin intersecting beams scanning the asteroid
        for(let i=0; i<5; i++) {
            const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 100, 8);
            const beam = new THREE.Mesh(beamGeo, laserMat);
            beam.position.y = 10;
            beam.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            laserGroup.add(beam);
            meshes.lasers.push({mesh: beam, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()});
        }
        return laserGroup;
    }

    function createSubatomicResonators() {
        const resGroup = new THREE.Group();
        meshes.resonators = [];

        // Small complex floating geometries around the asteroid
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            
            const shape = new THREE.TorusKnotGeometry(2, 0.5, 64, 8);
            const res = new THREE.Mesh(shape, higgsNodeMat);
            
            res.position.set(
                Math.cos(angle) * 35,
                10 + (i%2 === 0 ? 10 : -10),
                Math.sin(angle) * 35
            );
            resGroup.add(res);
            meshes.resonators.push(res);
        }
        return resGroup;
    }

    function createPowerCables() {
        const cableGroup = new THREE.Group();
        
        // Bundles of wires running along the floor
        for(let b=0; b<3; b++) {
            for(let i=0; i<5; i++) {
                const curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(110, -40, b*10 - 10),
                    new THREE.Vector3(50, -40, (b*10 - 10) * 0.5 + (i-2)*2),
                    new THREE.Vector3(20, -35, (i-2)*3),
                    new THREE.Vector3(0, -50, 0) // into the dark matter core
                ]);
                const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
                const mat = (i%2 === 0) ? rubber : copper;
                const tube = new THREE.Mesh(tubeGeo, mat);
                cableGroup.add(tube);
            }
        }
        return cableGroup;
    }

    function createMuonDetectors() {
        const detectorGroup = new THREE.Group();
        // Array of flat plates lining the upper containment vessel
        for(let i=0; i<16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const px = Math.cos(angle) * 55;
            const pz = Math.sin(angle) * 55;

            const plateGeo = new THREE.BoxGeometry(10, 15, 1);
            const plate = new THREE.Mesh(plateGeo, aluminum);
            plate.position.set(px, 20, pz);
            plate.lookAt(0, 20, 0);
            detectorGroup.add(plate);
        }
        return detectorGroup;
    }

    function createTachyonAntennas() {
        const antGroup = new THREE.Group();
        meshes.antennas = [];
        for(let i=0; i<4; i++) {
            const angle = (i / 4) * Math.PI * 2 + (Math.PI/4);
            const px = Math.cos(angle) * 120;
            const pz = Math.sin(angle) * 120;

            const baseGeo = new THREE.CylinderGeometry(3, 5, 10, 8);
            const base = new THREE.Mesh(baseGeo, steel);
            base.position.set(px, -35, pz);
            antGroup.add(base);

            const spireGeo = new THREE.CylinderGeometry(0.1, 1, 60, 8);
            const spire = new THREE.Mesh(spireGeo, chrome);
            spire.position.set(px, 0, pz);
            antGroup.add(spire);

            meshes.antennas.push(spire);
        }
        return antGroup;
    }

    function createGravitonPlates() {
        const plateGroup = new THREE.Group();
        // Heavy interlocking plates forming an inner floor
        const shape = new THREE.RingGeometry(15, 45, 12, 1);
        const geo = new THREE.ExtrudeGeometry(new THREE.Shape(shape.parameters.innerRadius ? [] : []), {depth: 2}); // fallback approximation below
        
        for(let i=0; i<12; i++) {
            const pGeo = new THREE.BoxGeometry(15, 2, 20);
            const p = new THREE.Mesh(pGeo, darkSteel);
            const angle = (i / 12) * Math.PI * 2;
            p.position.set(Math.cos(angle)*30, -28, Math.sin(angle)*30);
            p.lookAt(0, -28, 0);
            plateGroup.add(p);
        }
        return plateGroup;
    }

    // -----------------------------------------------------------------------------------
    // ASSEMBLY AND METADATA MAPPING
    // -----------------------------------------------------------------------------------

    const builders = [
        { name: 'BasePlatform', fn: createBasePlatform, desc: 'Massive hexagonal foundation housing structural supports and hydraulic dampening systems.', func: 'Provides structural integrity and vibration isolation for quantum operations.', mat: 'DarkSteel, Steel, Chrome' },
        { name: 'PrimaryContainmentVessel', fn: createContainmentVessel, desc: 'A vast spherical shell combining advanced sensor glass and reinforced steel ribs.', func: 'Contains the vacuum environment and exotic radiation emitted during Higgs manipulation.', mat: 'SensorGlass, Steel' },
        { name: 'SuperconductingToroidAlpha', fn: () => createToroid(60, 4, 120, steel, 'alpha'), desc: 'The outermost and largest magnetic containment ring wrapped with copper coils.', func: 'Generates the primary macroscopic magnetic field to stabilize the target.', mat: 'Steel, Copper, Plasma' },
        { name: 'SuperconductingToroidBeta', fn: () => createToroid(45, 3, 90, chrome, 'beta'), desc: 'Intermediate multi-axis rotating toroid array.', func: 'Focuses and aligns particle trajectories towards the target epicenter.', mat: 'Chrome, Copper, Plasma' },
        { name: 'SuperconductingToroidGamma', fn: () => createToroid(30, 2, 60, darkSteel, 'gamma'), desc: 'Innermost high-velocity containment ring.', func: 'Directly modulates the localized Higgs field excitation frequency.', mat: 'DarkSteel, Copper, Plasma' },
        { name: 'QuantumEmitterArray', fn: createQuantumEmitters, desc: 'Eight massive lathe-turned emitter arrays tipped with energy crystals.', func: 'Fires concentrated streams of exotic particles to disrupt the Higgs mechanism.', mat: 'Chrome, EnergyBeam' },
        { name: 'HiggsFieldLattice', fn: createHiggsLattice, desc: 'A pervasive glowing 3D lattice composed of discrete quantum nodes.', func: 'Visualizes and manipulates the local vacuum expectation value of the Higgs field.', mat: 'HiggsGlow, HiggsNode' },
        { name: 'TargetAsteroid', fn: createTargetAsteroid, desc: 'A hyper-dense, procedurally deformed celestial body trapped in the center.', func: 'The subject of mass manipulation, demonstrating physical reduction in inertial properties.', mat: 'ExoticAsteroid' },
        { name: 'CoolingTowerAssembly', fn: createCoolingTowers, desc: 'Four gigantic towers equipped with high-speed fans and plasma exhaust vents.', func: 'Dissipates the immense thermal energy generated by spontaneous symmetry breaking.', mat: 'Steel, Aluminum, Plastic' },
        { name: 'PlasmaInjectionConduits', fn: createPlasmaConduits, desc: 'Complex curved glass tubes carrying superheated plasma to the emitters.', func: 'Provides the raw energetic fuel necessary for particle acceleration.', mat: 'Glass, Plasma, Steel' },
        { name: 'ControlAndMonitoringNexus', fn: createControlNexus, desc: 'A heavily shielded cabin featuring tinted observation windows and radar arrays.', func: 'Houses the operators and quantum computer mainframes orchestrating the experiment.', mat: 'DarkSteel, Tinted, Aluminum' },
        { name: 'GravimetricSensors', fn: createGravimetricSensors, desc: 'Six perimeter-mounted rotating dish arrays with internal laser cores.', func: 'Measures minute fluctuations in local spacetime curvature and gravitational waves.', mat: 'Chrome, Copper, Laser' },
        { name: 'EnergyShieldGenerators', fn: createEnergyShieldGenerators, desc: 'Twelve nodes projecting an invisible, spherical containment shield.', func: 'Prevents catastrophic vacuum decay from propagating outside the device radius.', mat: 'DarkSteel, HiggsGlow' },
        { name: 'MagneticFluxCapacitors', fn: createFluxCapacitors, desc: 'Three massive copper-cored cylinders housed in glass casings with internal lightning.', func: 'Stores and instantaneously discharges petawatts of power for pulse operations.', mat: 'Copper, Glass, HiggsGlow' },
        { name: 'DarkMatterCore', fn: createDarkMatterCore, desc: 'A dense, light-absorbing sphere located deep beneath the platform.', func: 'Provides the exotic gravitational anchoring required to offset mass reductions.', mat: 'DarkMatter, Chrome' },
        { name: 'ExoticParticleBeams', fn: createParticleBeams, desc: 'Intense glowing cylinders of pure energy bridging the emitters to the asteroid.', func: 'Transfers the symmetry-breaking phase shift directly into the target\'s atomic structure.', mat: 'EnergyBeam' },
        { name: 'VacuumChamberSeals', fn: createVacuumSeals, desc: 'Twenty-four heavy mechanical clamps with rubber gaskets.', func: 'Ensures absolute zero atmospheric interference inside the containment vessel.', mat: 'Steel, Rubber' },
        { name: 'HydraulicDampers', fn: createHydraulicDampers, desc: 'Four massive angled hydraulic arms connecting to the toroid mounts.', func: 'Absorbs extreme kinetic kickback from gravitational anomalies.', mat: 'Chrome, DarkSteel' },
        { name: 'DiagnosticLasers', fn: createDiagnosticLasers, desc: 'Intersecting thin red laser beams constantly scanning the central area.', func: 'Provides real-time topological mapping of the target\'s disintegrating mass.', mat: 'Laser' },
        { name: 'SubatomicResonators', fn: createSubatomicResonators, desc: 'Twelve complex knot geometries floating in suspended animation.', func: 'Harmonizes the vibrational frequencies of quarks within the target.', mat: 'HiggsNode' },
        { name: 'PowerCables', fn: createPowerCables, desc: 'Thick bundles of insulated wiring running across the facility floor.', func: 'Routes power from the Dark Matter Core to peripheral systems.', mat: 'Rubber, Copper' },
        { name: 'MuonDetectors', fn: createMuonDetectors, desc: 'Sixteen flat aluminum plates arranged in a ring.', func: 'Detects high-energy decay products escaping the primary reaction.', mat: 'Aluminum' },
        { name: 'TachyonAntennas', fn: createTachyonAntennas, desc: 'Four towering spires erected at the extreme edges of the facility.', func: 'Broadcasts faster-than-light telemetry data to orbital observation platforms.', mat: 'Steel, Chrome' },
        { name: 'GravitonPlates', fn: createGravitonPlates, desc: 'Interlocking heavy floor plating directly under the reaction zone.', func: 'Serves as the ultimate backstop for focused gravitational waves.', mat: 'DarkSteel' }
    ];

    let assemblyIndex = 0;
    builders.forEach(b => {
        const meshGroup = b.fn();
        group.add(meshGroup);

        if (b.name === 'SuperconductingToroidAlpha') meshes.toroidAlpha = meshGroup;
        if (b.name === 'SuperconductingToroidBeta') meshes.toroidBeta = meshGroup;
        if (b.name === 'SuperconductingToroidGamma') meshes.toroidGamma = meshGroup;

        parts.push({
            name: b.name,
            description: b.desc,
            material: b.mat,
            function: b.func,
            assemblyOrder: assemblyIndex++,
            connections: builders.map(x => x.name).filter(n => n !== b.name && Math.random() > 0.8), // Randomized mock connections
            failureEffect: 'Catastrophic destabilization of the local Higgs field leading to localized vacuum decay or massive explosive energy release.',
            cascadeFailures: [builders[Math.floor(Math.random() * builders.length)].name],
            originalPosition: { x: meshGroup.position.x, y: meshGroup.position.y, z: meshGroup.position.z },
            explodedPosition: { 
                x: meshGroup.position.x + (Math.random() - 0.5) * 200, 
                y: meshGroup.position.y + (Math.random() - 0.5) * 200, 
                z: meshGroup.position.z + (Math.random() - 0.5) * 200 
            }
        });
    });

    const description = "The God Tier Higgs Field Manipulator is an ultra-advanced, theoretical megastructure designed to alter the fundamental laws of physics. By generating a localized phase transition in the Higgs field via exotic particle bombardment and macroscopic quantum resonance, this machine temporarily decouples fermions and W/Z bosons from the field, effectively reducing or eliminating their inertial mass. Features 24 highly complex, massively detailed sub-assemblies including superconducting toroids, quantum emitter arrays, dark matter cores, and a procedurally dynamic target asteroid.";

    const quizQuestions = [
        {
            question: "In the context of the Standard Model, how does the spontaneous symmetry breaking of the SU(2) x U(1) gauge group endow the W and Z bosons with mass while leaving the photon massless?",
            options: [
                "The Higgs field acquires a vacuum expectation value that couples to all gauge bosons equally, but the photon's mass is cancelled by dark energy.",
                "The W and Z bosons absorb three Goldstone bosons from the complex scalar Higgs doublet (becoming their longitudinal states), while the unbroken U(1)_em symmetry ensures the photon remains massless.",
                "The photon is a fermion and thus does not interact with the scalar Higgs field, preventing mass acquisition.",
                "Symmetry breaking occurs at the Planck scale, generating gravitational waves that mimic mass for the W and Z bosons."
            ],
            correctAnswer: 1,
            explanation: "The Higgs mechanism results in the W and Z bosons 'eating' the Goldstone bosons to gain longitudinal polarization states (and mass), while the electromagnetic U(1) symmetry remains unbroken."
        },
        {
            question: "Which of the following describes the relationship between the Higgs boson's mass and the concept of vacuum stability in the universe?",
            options: [
                "A Higgs mass of ~125 GeV places the universe in a metastable state where our electroweak vacuum may quantum tunnel to a deeper, catastrophic true vacuum.",
                "The Higgs mass proves the universe is completely stable because it is lighter than the top quark.",
                "Vacuum stability relies solely on the cosmological constant; the Higgs mass is irrelevant.",
                "The 125 GeV mass causes the vacuum to boil spontaneously, creating virtual particles that stabilize spacetime."
            ],
            correctAnswer: 0,
            explanation: "Given the measured masses of the Higgs and the top quark, the effective potential of the Higgs field turns negative at very high energies, implying our current vacuum is merely metastable."
        },
        {
            question: "In quantum field theory, the Yukawa coupling between the Higgs field and a fermion determines what fundamental property of the fermion?",
            options: [
                "Its electric charge.",
                "Its color charge in quantum chromodynamics.",
                "Its rest mass, which is proportional to the vacuum expectation value (VEV) and the coupling constant.",
                "Its intrinsic spin and magnetic moment."
            ],
            correctAnswer: 2,
            explanation: "Fermion masses are generated by their Yukawa interactions with the Higgs field; mass equals the Yukawa coupling constant times the Higgs VEV divided by the square root of 2."
        },
        {
            question: "How does this 'God Tier' manipulator theoretically alter the inertial mass of the target asteroid without changing its atomic composition?",
            options: [
                "By heating the asteroid to plasma, reducing its density.",
                "By emitting anti-gravitons that push against the Earth's gravity field.",
                "By locally modifying the vacuum expectation value of the Higgs field, thereby altering the coupling strength and reducing the rest mass of its constituent elementary particles.",
                "By accelerating the asteroid to near light-speed, taking advantage of time dilation."
            ],
            correctAnswer: 2,
            explanation: "If one could artificially manipulate the Higgs VEV in a localized region, the masses of electrons and quarks inside that region would change, altering the macroscopic inertial mass of the object."
        },
        {
            question: "What role do virtual particle-antiparticle pairs play in the 'naturalness' or hierarchy problem of the Higgs boson mass?",
            options: [
                "They produce quantum corrections to the Higgs mass that are quadratically divergent, driving the theoretical mass toward the Planck scale unless extreme fine-tuning occurs.",
                "They decay into dark matter, solving the hierarchy problem.",
                "They shield the Higgs field, keeping its mass exactly at 125 GeV naturally.",
                "They prevent the Higgs from interacting with the strong nuclear force."
            ],
            correctAnswer: 0,
            explanation: "In the Standard Model, loop corrections to the Higgs mass from virtual particles grow with the square of the cutoff scale (e.g., Planck mass), requiring absurdly precise cancellations (fine-tuning) to keep the mass at 125 GeV."
        }
    ];

    // -----------------------------------------------------------------------------------
    // HYPER-COMPLEX ANIMATION LOGIC
    // -----------------------------------------------------------------------------------

    function animate(time, speed, m) {
        const t = time * speed;
        
        // 1. Toroid Rotations (Nested complex rotations)
        if (m.toroidAlpha) {
            m.toroidAlpha.rotation.x = Math.sin(t * 0.1) * 0.2;
            m.toroidAlpha.rotation.y = t * 0.5;
            m.toroidAlpha.rotation.z = Math.cos(t * 0.15) * 0.1;
        }
        if (m.toroidBeta) {
            m.toroidBeta.rotation.x = t * 0.8;
            m.toroidBeta.rotation.y = -t * 0.6;
        }
        if (m.toroidGamma) {
            m.toroidGamma.rotation.x = -t * 1.5;
            m.toroidGamma.rotation.z = t * 2.0;
        }

        // 2. Asteroid Mass Manipulation & Morphing
        if (m.asteroid && m.asteroidGeo && m.asteroidOriginalVertices) {
            const cycle = (Math.sin(t * 0.5) + 1) / 2; // 0 to 1
            
            // Float higher and faster as mass decreases
            m.asteroid.position.y = 10 + (cycle * 25) + Math.sin(t * 5.0) * (cycle * 2.0);
            m.asteroid.rotation.x += 0.01 + (cycle * 0.05);
            m.asteroid.rotation.y += 0.02 + (cycle * 0.1);

            // Deform vertices dynamically
            const pos = m.asteroidGeo.attributes.position;
            const v = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++) {
                v.copy(m.asteroidOriginalVertices[i]);
                
                // High-frequency noise when mass is low (cycle near 1)
                if (cycle > 0.1) {
                    const noise = Math.sin(v.x*t*2.0) * Math.cos(v.y*t*2.0) * Math.sin(v.z*t*2.0);
                    v.addScaledVector(v.clone().normalize(), noise * cycle * 2.0);
                }
                
                // Shrink overall volume to simulate mass loss
                v.multiplyScalar(1.0 - (cycle * 0.3));
                
                pos.setXYZ(i, v.x, v.y, v.z);
            }
            m.asteroidGeo.computeVertexNormals();
            m.asteroidGeo.attributes.position.needsUpdate = true;

            // Material shift: rock to glowing energy
            exoticAsteroidMat.emissiveIntensity = cycle * 3.0;
            exoticAsteroidMat.emissive.setHex(cycle > 0.5 ? 0x00ffff : 0x000000);
            
            // Debris ring orbiting faster and expanding
            if (m.asteroidDebris) {
                m.asteroidDebris.position.y = m.asteroid.position.y;
                m.asteroidDebris.rotation.y = t * (1.0 + cycle * 5.0);
                const scale = 1.0 + cycle * 2.0;
                m.asteroidDebris.scale.set(scale, scale, scale);
            }
        }

        // 3. Higgs Lattice pulsing
        if (m.latticeEnvelope) {
            const pulse = (Math.sin(t * 3.0) + 1) / 2;
            m.latticeEnvelope.scale.setScalar(1.0 + pulse * 0.05);
            higgsGlowMat.emissiveIntensity = 1.0 + pulse * 2.0;
            higgsGlowMat.opacity = 0.5 + pulse * 0.4;
        }

        // 4. Particle Beams widening and intensifying
        if (m.beams) {
            const cycle = (Math.sin(t * 0.5) + 1) / 2;
            m.beams.forEach((beam, idx) => {
                const noise = Math.sin(t * 10.0 + idx) * 0.5 + 0.5;
                beam.scale.x = 1.0 + (cycle * 4.0) * noise;
                beam.scale.z = 1.0 + (cycle * 4.0) * noise;
                energyBeamMat.emissiveIntensity = 2.0 + (cycle * 4.0) * noise;
            });
        }

        // 5. Cooling Fans and Vents
        if (m.fans) {
            m.fans.forEach(fan => {
                fan.rotation.y -= t * 10.0; // Spin extremely fast
            });
        }

        // 6. Gravimetric Sensors rotating
        if (m.sensors) {
            m.sensors.forEach((s, idx) => {
                s.array.rotation.z = t * (2.0 + idx * 0.5);
                s.core.scale.setScalar(1.0 + Math.sin(t * 5.0 + idx) * 0.5);
            });
        }

        // 7. Dark Matter Core pulsing
        if (m.coreRings) {
            m.coreRings.forEach((ring, idx) => {
                ring.rotation.x += 0.01 * (idx + 1);
                ring.rotation.y -= 0.02 * (idx + 1);
                const s = 1.0 + Math.sin(t * 2.0 + idx) * 0.1;
                ring.scale.set(s, s, s);
            });
        }

        // 8. Diagnostic Lasers scanning
        if (m.lasers) {
            m.lasers.forEach(l => {
                l.mesh.rotateOnAxis(l.axis, 0.05);
            });
        }

        // 9. Subatomic Resonators floating
        if (m.resonators) {
            m.resonators.forEach((r, idx) => {
                r.rotation.x += 0.03;
                r.rotation.y += 0.04;
                r.position.y += Math.sin(t * 2.0 + idx) * 0.2;
            });
        }
        
        // 10. Emitters vibrating under load
        if (m.emitters) {
            m.emitters.forEach(e => {
                const cycle = (Math.sin(t * 0.5) + 1) / 2;
                e.position.y = 10 + (Math.random() - 0.5) * cycle; // Vibration
            });
        }

        // 11. Energy Shield fluctuation
        if (m.energyShield) {
            m.energyShield.material.opacity = 0.3 + Math.sin(t * 4.0) * 0.1;
            m.energyShield.scale.setScalar(1.0 + Math.sin(t * 2.0) * 0.01);
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}
