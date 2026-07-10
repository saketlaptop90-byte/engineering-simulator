import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        heatPipes: [],
        flames: [],
        mirrorsNorth: [],
        mirrorsSouth: [],
        dockingRings: [],
        hydraulics: []
    };

    // -------------------------------------------------------------------------
    // CUSTOM HIGHLIGHT & GLOW MATERIALS
    // -------------------------------------------------------------------------
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 2.0, metalness: 0.5, roughness: 0.5 });
    const emissiveGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00, emissiveIntensity: 1.5, metalness: 0.1, roughness: 0.8 });
    const landscapeMat = new THREE.MeshStandardMaterial({ color: 0x1a4a1a, roughness: 0.95, metalness: 0.05 });
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0066ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });

    // Utility to create hydraulic tubing
    class TubeCurve extends THREE.Curve {
        constructor(scale = 1, invert = false) {
            super();
            this.scale = scale;
            this.invert = invert ? -1 : 1;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = (t * 20 - 10);
            const ty = Math.sin(t * Math.PI) * 15 * this.invert;
            const tz = Math.cos(t * Math.PI) * 5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }

    // -------------------------------------------------------------------------
    // 1. CENTRAL HABITATION SPHERE (HULL)
    // -------------------------------------------------------------------------
    const hullGroup = new THREE.Group();
    // Sphere with cutouts at the poles (phi limits)
    const hullGeometry = new THREE.SphereGeometry(500, 128, 128, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.7);
    const hullMesh = new THREE.Mesh(hullGeometry, darkSteel);
    hullMesh.material.side = THREE.DoubleSide;
    hullGroup.add(hullMesh);

    // Structural Ribs wrapping the hull
    for (let i = 0; i < 72; i++) {
        const angle = (i / 72) * Math.PI * 2;
        const ribGeom = new THREE.TorusGeometry(503, 3, 16, 128, Math.PI * 0.7);
        const ribMesh = new THREE.Mesh(ribGeom, steel);
        ribMesh.rotation.y = angle;
        ribMesh.rotation.x = Math.PI / 2;
        hullGroup.add(ribMesh);
    }
    
    // Equatorial reinforced ring
    const equatorGeom = new THREE.TorusGeometry(502, 8, 32, 256);
    const equatorMesh = new THREE.Mesh(equatorGeom, chrome);
    equatorMesh.rotation.x = Math.PI / 2;
    hullGroup.add(equatorMesh);

    // Add thousands of tiny lit windows across the exterior
    const windowScatterGeom = new THREE.BoxGeometry(2, 2, 2);
    for(let i=0; i<500; i++) {
        const phi = Math.PI * 0.2 + Math.random() * Math.PI * 0.6;
        const theta = Math.random() * Math.PI * 2;
        const wMesh = new THREE.Mesh(windowScatterGeom, emissiveBlue);
        const r = 500;
        wMesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );
        wMesh.lookAt(new THREE.Vector3(0,0,0));
        hullGroup.add(wMesh);
    }

    group.add(hullGroup);
    meshes.centralHull = hullGroup;

    parts.push({
        name: "Central Habitation Sphere",
        description: "The primary living area of the Bernal Sphere, rotating to provide artificial gravity. Heavily armored with dark steel and structural ribs.",
        material: "darkSteel",
        function: "Maintains atmospheric pressure and structural integrity for the internal biome.",
        assemblyOrder: 1,
        connections: ["Polar Windows", "Equatorial Thrusters", "Internal Landscape"],
        failureEffect: "Catastrophic depressurization and loss of internal biosphere.",
        cascadeFailures: ["Complete Station Loss", "Population Extinction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -1000 }
    });

    // -------------------------------------------------------------------------
    // 2. INTERNAL LANDSCAPE
    // -------------------------------------------------------------------------
    const landscapeGroup = new THREE.Group();
    // Inner cylindrical terrain
    const landscapeGeom = new THREE.CylinderGeometry(490, 490, 400, 256, 128, true);
    const posAttribute = landscapeGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        const noise = (Math.sin(x * 0.05) + Math.cos(z * 0.05) + Math.sin(y * 0.1)) * 10 + Math.random() * 5;
        const scale = (490 - noise) / 490;
        posAttribute.setX(i, x * scale);
        posAttribute.setZ(i, z * scale);
    }
    landscapeGeom.computeVertexNormals();
    const landscapeMesh = new THREE.Mesh(landscapeGeom, landscapeMat);
    landscapeMesh.material.side = THREE.BackSide;
    landscapeGroup.add(landscapeMesh);

    // Central Internal Lake
    const lakeGeom = new THREE.CylinderGeometry(480, 480, 200, 128, 1, true);
    const lakeMesh = new THREE.Mesh(lakeGeom, waterMat);
    lakeMesh.material.side = THREE.BackSide;
    landscapeGroup.add(lakeMesh);

    // City structures wrapped along the internal surface
    const buildingGeom = new THREE.BoxGeometry(4, 1, 4);
    for (let i = 0; i < 400; i++) {
        const theta = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 350;
        const height = Math.random() * 25 + 5;
        const bMesh = new THREE.Mesh(buildingGeom, aluminum);
        bMesh.scale.y = height;
        const radius = 485 - height / 2;
        bMesh.position.set(Math.sin(theta) * radius, y, Math.cos(theta) * radius);
        bMesh.lookAt(new THREE.Vector3(0, y, 0));
        bMesh.rotation.x -= Math.PI / 2;
        
        // Add glowing windows to buildings
        if(Math.random() > 0.5) {
            const glow = new THREE.Mesh(new THREE.BoxGeometry(4.2, height * 0.8, 4.2), emissiveBlue);
            glow.material.wireframe = true;
            bMesh.add(glow);
        }
        landscapeGroup.add(bMesh);
    }

    hullGroup.add(landscapeGroup); // Attached to hull so it rotates with it

    parts.push({
        name: "Internal Landscape Biome",
        description: "A meticulously terraformed terrain wrapped around the internal equator, featuring valleys, lakes, and urban settlements.",
        material: "Organic / Synthetic Blend",
        function: "Provides a livable Earth-like environment, psychological comfort, and biological air cycling.",
        assemblyOrder: 2,
        connections: ["Central Habitation Sphere"],
        failureEffect: "Ecological collapse and severe life support strain.",
        cascadeFailures: ["Atmosphere Toxicity", "Resource Depletion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 1000 }
    });

    // -------------------------------------------------------------------------
    // 3 & 4. POLAR WINDOWS (NORTH & SOUTH)
    // -------------------------------------------------------------------------
    const windowGeom = new THREE.SphereGeometry(495, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.15);
    const windowNorth = new THREE.Mesh(windowGeom, glass);
    windowNorth.material.side = THREE.DoubleSide;
    hullGroup.add(windowNorth);

    const windowSouth = new THREE.Mesh(windowGeom, glass);
    windowSouth.rotation.x = Math.PI;
    windowSouth.material.side = THREE.DoubleSide;
    hullGroup.add(windowSouth);

    // Window Frames matching the spherical cap rim
    const frameRadius = 500 * Math.sin(Math.PI * 0.15);
    const frameY = 500 * Math.cos(Math.PI * 0.15);
    
    const frameNorthGeom = new THREE.TorusGeometry(frameRadius, 12, 32, 128);
    const frameNorth = new THREE.Mesh(frameNorthGeom, steel);
    frameNorth.position.y = frameY;
    frameNorth.rotation.x = Math.PI / 2;
    hullGroup.add(frameNorth);

    const frameSouth = new THREE.Mesh(frameNorthGeom, steel);
    frameSouth.position.y = -frameY;
    frameSouth.rotation.x = Math.PI / 2;
    hullGroup.add(frameSouth);

    parts.push({
        name: "North Polar Window",
        description: "Massive transparent hemisphere allowing reflected sunlight to enter the station.",
        material: "glass",
        function: "Natural illumination and passive solar heating.",
        assemblyOrder: 3,
        connections: ["Central Habitation Sphere"],
        failureEffect: "Loss of natural light and severe thermal drop.",
        cascadeFailures: ["Crop failure", "Atmospheric freezing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 800, z: 0 }
    });

    parts.push({
        name: "South Polar Window",
        description: "Massive transparent hemisphere allowing reflected sunlight to enter the station from the south.",
        material: "glass",
        function: "Natural illumination and passive solar heating.",
        assemblyOrder: 4,
        connections: ["Central Habitation Sphere"],
        failureEffect: "Loss of natural light and severe thermal drop.",
        cascadeFailures: ["Crop failure", "Atmospheric freezing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -800, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 5. CENTRAL HUB SPINE
    // -------------------------------------------------------------------------
    const spineGeom = new THREE.CylinderGeometry(60, 60, 2400, 64);
    const spineMesh = new THREE.Mesh(spineGeom, aluminum);
    group.add(spineMesh); // Independent of hull rotation
    meshes.centralSpine = spineMesh;

    parts.push({
        name: "Central Hub Spine",
        description: "The zero-gravity stationary axis running through the entire structure.",
        material: "aluminum",
        function: "Provides mounting points for mirrors, radiators, and docking ports. Serves as the zero-g transit corridor.",
        assemblyOrder: 5,
        connections: ["Solar Mirrors", "Docking Ports", "Radiators"],
        failureEffect: "Total structural shearing and loss of attitude control.",
        cascadeFailures: ["Station breakup"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2000, y: 0, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 6, 7, 8. AGRICULTURAL RINGS
    // -------------------------------------------------------------------------
    const agriRingsGroup = new THREE.Group();
    const ringRadii = [650, 800, 950];
    const ringTubes = [40, 50, 60];
    const ringNames = ["Inner Agricultural Ring", "Middle Agricultural Ring", "Outer Agricultural Ring"];
    
    ringRadii.forEach((r, idx) => {
        const ringGroup = new THREE.Group();
        
        // Base Torus
        const ringGeom = new THREE.TorusGeometry(r, ringTubes[idx], 64, 256);
        const ringMesh = new THREE.Mesh(ringGeom, aluminum);
        ringMesh.rotation.x = Math.PI / 2;
        ringGroup.add(ringMesh);
        
        // Transparent Greenhouse upper section
        const greenhouseGeom = new THREE.TorusGeometry(r, ringTubes[idx] + 2, 32, 128, Math.PI);
        const greenhouseMesh = new THREE.Mesh(greenhouseGeom, glass);
        greenhouseMesh.rotation.x = Math.PI / 2;
        ringGroup.add(greenhouseMesh);
        
        // Soil / Bio-matter inside
        const soilGeom = new THREE.TorusGeometry(r, ringTubes[idx] - 5, 32, 256, Math.PI);
        const soilMesh = new THREE.Mesh(soilGeom, landscapeMat);
        soilMesh.rotation.x = Math.PI / 2;
        soilMesh.rotation.y = Math.PI; // flip to bottom
        ringGroup.add(soilMesh);

        // Add structural binding bands around the torus
        for(let b=0; b<36; b++) {
            const bandAngle = (b/36)*Math.PI*2;
            const bandGeom = new THREE.TorusGeometry(ringTubes[idx] + 4, 3, 16, 32);
            const bandMesh = new THREE.Mesh(bandGeom, darkSteel);
            bandMesh.position.set(Math.cos(bandAngle)*r, 0, Math.sin(bandAngle)*r);
            bandMesh.lookAt(new THREE.Vector3(0,0,0));
            bandMesh.rotation.y += Math.PI/2;
            ringGroup.add(bandMesh);
        }

        // Spokes connecting ring to the hull equator
        for (let s = 0; s < 12; s++) {
            const angle = (s / 12) * Math.PI * 2;
            const spokeLength = r - 500;
            const spokeGeom = new THREE.CylinderGeometry(15, 15, spokeLength, 32);
            const spokeMesh = new THREE.Mesh(spokeGeom, steel);
            spokeMesh.position.set(Math.cos(angle) * (500 + spokeLength/2), 0, Math.sin(angle) * (500 + spokeLength/2));
            spokeMesh.rotation.x = Math.PI / 2;
            spokeMesh.rotation.z = -angle;
            ringGroup.add(spokeMesh);
            
            // Add hydraulic fluid lines along spokes
            const lineGeom = new THREE.CylinderGeometry(3, 3, spokeLength, 8);
            const lineMesh = new THREE.Mesh(lineGeom, copper);
            lineMesh.position.copy(spokeMesh.position);
            lineMesh.position.y += 18;
            lineMesh.rotation.copy(spokeMesh.rotation);
            ringGroup.add(lineMesh);
        }

        agriRingsGroup.add(ringGroup);

        parts.push({
            name: ringNames[idx],
            description: `Torus ${idx+1} dedicated to hydroponics, aeroponics, and livestock, providing the station's food supply.`,
            material: "aluminum and glass",
            function: "Food production and secondary oxygen recycling.",
            assemblyOrder: 6 + idx,
            connections: ["Central Habitation Sphere", "Transit Spokes"],
            failureEffect: "Starvation and loss of secondary life support.",
            cascadeFailures: ["Rationing", "Famine"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 1200 + idx*400 }
        });
    });
    
    hullGroup.add(agriRingsGroup); // Rotate with hull
    meshes.agriRings = agriRingsGroup;

    // -------------------------------------------------------------------------
    // 9 & 10. SOLAR MIRROR ARRAYS
    // -------------------------------------------------------------------------
    function createMirrorArray(isNorth) {
        const mirrorGroup = new THREE.Group();
        const numMirrors = 36;
        const mirrorYBase = isNorth ? 800 : -800;
        const mirrorDist = 900;
        
        for (let i = 0; i < numMirrors; i++) {
            const angle = (i / numMirrors) * Math.PI * 2;
            
            // Mirror frame and reflective surface
            const mContainer = new THREE.Group();
            
            const mirrorGeom = new THREE.PlaneGeometry(120, 250);
            const mirrorMesh = new THREE.Mesh(mirrorGeom, chrome);
            mirrorMesh.material.side = THREE.DoubleSide;
            
            const backingGeom = new THREE.BoxGeometry(122, 252, 5);
            const backingMesh = new THREE.Mesh(backingGeom, darkSteel);
            backingMesh.position.z = -2.5;

            mContainer.add(mirrorMesh);
            mContainer.add(backingMesh);
            
            // Position in a wide ring above/below the pole
            mContainer.position.set(Math.cos(angle) * mirrorDist, mirrorYBase, Math.sin(angle) * mirrorDist);
            
            // Angle to reflect sunlight down into the polar window
            mContainer.lookAt(new THREE.Vector3(0, isNorth ? 400 : -400, 0));
            
            // Complex Truss connecting mirror to the spine
            const trussGeom = new THREE.CylinderGeometry(8, 8, mirrorDist, 16);
            const trussMesh = new THREE.Mesh(trussGeom, darkSteel);
            trussMesh.position.set(Math.cos(angle) * mirrorDist / 2, mirrorYBase, Math.sin(angle) * mirrorDist / 2);
            trussMesh.lookAt(mContainer.position);
            trussMesh.rotation.x += Math.PI / 2;
            
            // Add hydraulic adjustment pistons at the base of the mirror
            const pistonGeom = new THREE.CylinderGeometry(4, 4, 80, 16);
            const pistonMesh = new THREE.Mesh(pistonGeom, copper);
            pistonMesh.position.set(Math.cos(angle) * (mirrorDist - 50), mirrorYBase - 20, Math.sin(angle) * (mirrorDist - 50));
            pistonMesh.lookAt(mContainer.position);
            pistonMesh.rotation.x += Math.PI / 2;

            mirrorGroup.add(mContainer);
            mirrorGroup.add(trussMesh);
            mirrorGroup.add(pistonMesh);
        }
        return mirrorGroup;
    }

    const mirrorsNorth = createMirrorArray(true);
    group.add(mirrorsNorth);
    meshes.mirrorsNorth = mirrorsNorth;

    const mirrorsSouth = createMirrorArray(false);
    group.add(mirrorsSouth);
    meshes.mirrorsSouth = mirrorsSouth;

    parts.push({
        name: "North Solar Mirror Array",
        description: "An array of 36 massive movable mirrors reflecting sunlight into the north polar window.",
        material: "chrome and darkSteel",
        function: "Sunlight capture and redirection.",
        assemblyOrder: 9,
        connections: ["Central Hub Spine"],
        failureEffect: "Total darkness in the northern hemisphere.",
        cascadeFailures: ["Photosynthesis halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: "South Solar Mirror Array",
        description: "An array of 36 massive movable mirrors reflecting sunlight into the south polar window.",
        material: "chrome and darkSteel",
        function: "Sunlight capture and redirection.",
        assemblyOrder: 10,
        connections: ["Central Hub Spine"],
        failureEffect: "Total darkness in the southern hemisphere.",
        cascadeFailures: ["Photosynthesis halt"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -1500, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 11 & 12. RADIATOR ARRAYS
    // -------------------------------------------------------------------------
    function createRadiators(isNorth) {
        const radGroup = new THREE.Group();
        const radY = isNorth ? 500 : -500;
        const numPanels = 24;
        
        for (let i = 0; i < numPanels; i++) {
            const angle = (i / numPanels) * Math.PI * 2;
            const panelGeom = new THREE.BoxGeometry(10, 600, 250);
            const panelMesh = new THREE.Mesh(panelGeom, copper);
            
            panelMesh.position.set(Math.cos(angle) * 200, radY, Math.sin(angle) * 200);
            panelMesh.lookAt(new THREE.Vector3(0, radY, 0));
            
            // Add glowing heat pipes traversing the panel
            for(let j=0; j<5; j++) {
                const pipeGeom = new THREE.CylinderGeometry(3, 3, 580, 12);
                const pipeMesh = new THREE.Mesh(pipeGeom, emissiveRed);
                pipeMesh.position.z = 6;
                pipeMesh.position.x = (j - 2) * 40;
                panelMesh.add(pipeMesh);
                meshes.heatPipes.push(pipeMesh);
            }
            
            radGroup.add(panelMesh);
        }
        return radGroup;
    }

    const radsNorth = createRadiators(true);
    group.add(radsNorth);
    
    const radsSouth = createRadiators(false);
    group.add(radsSouth);

    parts.push({
        name: "North Radiator Array",
        description: "Extensive copper fin arrays designed to dissipate the immense heat generated by the station into space.",
        material: "copper",
        function: "Thermal regulation and heat exhaust.",
        assemblyOrder: 11,
        connections: ["Central Hub Spine"],
        failureEffect: "Station overheating.",
        cascadeFailures: ["Equipment melting", "Atmospheric boiling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -1000, y: 500, z: 0 }
    });

    parts.push({
        name: "South Radiator Array",
        description: "Extensive copper fin arrays for heat dissipation on the southern hemisphere.",
        material: "copper",
        function: "Thermal regulation and heat exhaust.",
        assemblyOrder: 12,
        connections: ["Central Hub Spine"],
        failureEffect: "Station overheating.",
        cascadeFailures: ["Equipment melting", "Atmospheric boiling"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -1000, y: -500, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 13 & 14. DOCKING PORTS
    // -------------------------------------------------------------------------
    function createDockingPort(isNorth) {
        const dockGroup = new THREE.Group();
        const yPos = isNorth ? 1150 : -1150;
        const dir = isNorth ? 1 : -1;
        
        // Main Hub Cylinder
        const hubGeom = new THREE.CylinderGeometry(100, 100, 150, 64);
        const hubMesh = new THREE.Mesh(hubGeom, darkSteel);
        hubMesh.position.y = yPos;
        dockGroup.add(hubMesh);
        
        // Neon Docking Ring
        const ringGeom = new THREE.TorusGeometry(180, 12, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeom, emissiveBlue);
        ringMesh.position.y = yPos + (50 * dir);
        ringMesh.rotation.x = Math.PI / 2;
        dockGroup.add(ringMesh);
        meshes.dockingRings.push(ringMesh);

        // Complex Hydraulic Docking Arms
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const armGroup = new THREE.Group();
            
            const outerGeom = new THREE.CylinderGeometry(15, 15, 120, 32);
            const outer = new THREE.Mesh(outerGeom, steel);
            outer.rotation.x = Math.PI / 2;
            
            const innerGeom = new THREE.CylinderGeometry(10, 10, 100, 32);
            const inner = new THREE.Mesh(innerGeom, chrome);
            inner.rotation.x = Math.PI / 2;
            inner.position.z = 60;
            
            // Hydraulic Tubes
            const path = new TubeCurve(3, i%2===0);
            const tubeGeom = new THREE.TubeGeometry(path, 32, 2, 12, false);
            const tube = new THREE.Mesh(tubeGeom, rubber);
            tube.position.set(20, 0, 30);
            
            const grabberGeom = new THREE.BoxGeometry(30, 40, 20);
            const grabber = new THREE.Mesh(grabberGeom, darkSteel);
            grabber.position.z = 120;
            
            armGroup.add(outer);
            armGroup.add(inner);
            armGroup.add(tube);
            armGroup.add(grabber);
            
            armGroup.position.set(Math.cos(angle) * 120, yPos, Math.sin(angle) * 120);
            armGroup.lookAt(new THREE.Vector3(Math.cos(angle) * 300, yPos, Math.sin(angle) * 300));
            
            dockGroup.add(armGroup);
            meshes.hydraulics.push({ inner, grabber, baseZ: 60, timeOffset: i });
        }
        
        return dockGroup;
    }

    const dockNorth = createDockingPort(true);
    group.add(dockNorth);

    const dockSouth = createDockingPort(false);
    group.add(dockSouth);

    parts.push({
        name: "North Docking Port",
        description: "Zero-gravity docking hub featuring complex hydraulic arms and magnetic capture rings.",
        material: "darkSteel and steel",
        function: "Receives cargo and passenger spacecraft along the stationary axis.",
        assemblyOrder: 13,
        connections: ["Central Hub Spine"],
        failureEffect: "Inability to receive supplies or evacuate.",
        cascadeFailures: ["Logistics breakdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2200, z: 0 }
    });

    parts.push({
        name: "South Docking Port",
        description: "Zero-gravity secondary docking hub featuring complex hydraulic arms.",
        material: "darkSteel and steel",
        function: "Receives cargo and passenger spacecraft.",
        assemblyOrder: 14,
        connections: ["Central Hub Spine"],
        failureEffect: "Inability to receive supplies or evacuate.",
        cascadeFailures: ["Logistics breakdown"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2200, z: 0 }
    });

    // -------------------------------------------------------------------------
    // 15. EQUATORIAL THRUSTER ARRAY
    // -------------------------------------------------------------------------
    const thrusterGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i/16)*Math.PI*2;
        const thrusterBaseGeom = new THREE.BoxGeometry(40, 40, 60);
        const thrusterBase = new THREE.Mesh(thrusterBaseGeom, darkSteel);
        thrusterBase.position.set(Math.cos(angle)*515, 0, Math.sin(angle)*515);
        thrusterBase.lookAt(new THREE.Vector3(0,0,0));
        
        const nozzleGeom = new THREE.CylinderGeometry(20, 10, 30, 32);
        const nozzle = new THREE.Mesh(nozzleGeom, copper);
        nozzle.rotation.x = Math.PI/2;
        nozzle.position.z = 45; 
        
        const flameGeom = new THREE.CylinderGeometry(15, 0, 80, 32);
        const flame = new THREE.Mesh(flameGeom, emissiveBlue);
        flame.rotation.x = Math.PI/2;
        flame.position.z = 100;
        
        meshes.flames.push(flame);
        
        thrusterBase.add(nozzle);
        thrusterBase.add(flame);
        thrusterGroup.add(thrusterBase);
    }
    hullGroup.add(thrusterGroup); // Rotates with hull

    parts.push({
        name: "Equatorial Thruster Array",
        description: "Massive plasma thrusters mounted on the equator to maintain spin rate.",
        material: "copper and darkSteel",
        function: "Attitude control and spin-up/spin-down for artificial gravity adjustments.",
        assemblyOrder: 15,
        connections: ["Central Habitation Sphere"],
        failureEffect: "Loss of spin.",
        cascadeFailures: ["Zero-G inside habitation zone", "Biome destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -1500 }
    });

    // -------------------------------------------------------------------------
    // 16. TRANSIT SPOKES
    // -------------------------------------------------------------------------
    const spokeGroup = new THREE.Group();
    // Connects the inner landscape to the central hub (elevators)
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const spokeGeom = new THREE.CylinderGeometry(20, 20, 490, 32);
        const spokeMesh = new THREE.Mesh(spokeGeom, steel);
        
        spokeMesh.position.set(Math.cos(angle) * 245, 0, Math.sin(angle) * 245);
        spokeMesh.rotation.x = Math.PI / 2;
        spokeMesh.rotation.z = -angle;
        
        // Add elevator car detail
        const carGeom = new THREE.BoxGeometry(25, 40, 25);
        const carMesh = new THREE.Mesh(carGeom, emissiveWhite);
        carMesh.position.y = Math.random() * 200 - 100;
        spokeMesh.add(carMesh);

        spokeGroup.add(spokeMesh);
    }
    hullGroup.add(spokeGroup); // Rotates with hull

    parts.push({
        name: "Transit Spokes",
        description: "Huge elevator shafts connecting the zero-g central hub to the 1G habitation ring.",
        material: "steel",
        function: "Crew and cargo transit.",
        assemblyOrder: 16,
        connections: ["Central Hub Spine", "Central Habitation Sphere"],
        failureEffect: "Isolation of the habitation ring from the docking hubs.",
        cascadeFailures: ["Supply chain collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 2000 }
    });

    // -------------------------------------------------------------------------
    // 17. COMMUNICATION ARRAY
    // -------------------------------------------------------------------------
    const commsGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const angle = (i/3) * Math.PI * 2;
        const dishGeom = new THREE.SphereGeometry(60, 64, 32, 0, Math.PI*2, 0, Math.PI/2.5);
        const dish = new THREE.Mesh(dishGeom, aluminum);
        dish.position.set(Math.cos(angle)*250, 1300, Math.sin(angle)*250);
        dish.lookAt(new THREE.Vector3(Math.cos(angle)*1500, 3000, Math.sin(angle)*1500));
        dish.material.side = THREE.DoubleSide;
        
        const antennaGeom = new THREE.CylinderGeometry(3, 3, 100, 16);
        const antenna = new THREE.Mesh(antennaGeom, steel);
        antenna.position.z = 50;
        antenna.rotation.x = Math.PI/2;
        dish.add(antenna);
        
        const glowGeom = new THREE.SphereGeometry(8, 32, 32);
        const glow = new THREE.Mesh(glowGeom, emissiveGreen);
        glow.position.y = 50;
        antenna.add(glow);

        commsGroup.add(dish);
    }
    group.add(commsGroup); // On stationary hub

    parts.push({
        name: "Deep Space Communication Array",
        description: "Massive parabolic dishes and quantum entanglement transceivers.",
        material: "aluminum",
        function: "Maintains high-bandwidth telemetry with Earth and other colonies.",
        assemblyOrder: 17,
        connections: ["Central Hub Spine"],
        failureEffect: "Total communication blackout.",
        cascadeFailures: ["Navigation errors", "Isolation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2800, z: 0 }
    });


    // -------------------------------------------------------------------------
    // QUIZ QUESTIONS
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary function of the massive equatorial rotation in a Bernal Sphere?",
            options: ["To generate magnetic shielding", "To simulate Earth-like artificial gravity via centrifugal force", "To distribute solar radiation evenly", "To power the central engines"],
            correctAnswer: 1,
            explanation: "The central habitation sphere rotates continuously to push inhabitants toward the inner equator, simulating 1G gravity."
        },
        {
            question: "How does natural sunlight enter the internal landscape?",
            options: ["Through the transparent equatorial hull", "It doesn't, artificial LEDs are used entirely", "Through massive polar windows via angled solar reflection mirrors", "Through fiber-optic cables"],
            correctAnswer: 2,
            explanation: "Massive arrays of solar mirrors are positioned at the poles to reflect sunlight through huge glass windows, naturally illuminating the interior."
        },
        {
            question: "Why are the agricultural rings located on the exterior of the main hull?",
            options: ["To keep them hidden", "To allow for specific gravity levels and prevent catastrophic biological cross-contamination", "Because there is no space inside", "To absorb micrometeorites"],
            correctAnswer: 1,
            explanation: "Exterior rings allow independent environmental control, optimized gravity levels for plants/livestock, and safeguard the main population from agricultural pathogens."
        },
        {
            question: "What is the purpose of the massive copper arrays attached to the central spine?",
            options: ["To act as antennas", "To generate solar power", "To dissipate extreme heat buildup into the vacuum of space as radiators", "To store physical data"],
            correctAnswer: 2,
            explanation: "Megastructures trap immense amounts of heat from life support and industry; these radiator arrays are critical for venting that thermal energy."
        },
        {
            question: "Why does the central hub spine remain stationary relative to the rotating hull?",
            options: ["It is broken", "To provide a zero-gravity environment for docking spacecraft and scientific research", "To save energy", "To prevent motion sickness for tourists"],
            correctAnswer: 1,
            explanation: "A non-rotating central axis provides 0G, which is essential for safely docking ships and conducting advanced manufacturing without rotational shear forces."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------------------
    function animate(time, speed, meshesObj) {
        const t = time * 0.001;
        const spinSpeed = speed * 0.002;

        // 1. Rotate main hull and attached groups (simulates gravity)
        if(meshesObj.centralHull) meshesObj.centralHull.rotation.y += spinSpeed;
        
        // 2. Pulse plasma thrusters
        if(meshesObj.flames) {
            meshesObj.flames.forEach((flame, idx) => {
                flame.scale.y = 1 + Math.sin(t * 15 + idx) * 0.3;
                flame.material.emissiveIntensity = 2 + Math.sin(t * 15 + idx) * 1.5;
            });
        }

        // 3. Pulse radiator heat pipes
        if(meshesObj.heatPipes) {
            meshesObj.heatPipes.forEach((pipe, idx) => {
                pipe.material.emissiveIntensity = 1.5 + Math.sin(t * 3 + idx * 0.1) * 1.0;
            });
        }

        // 4. Slow tracking of solar mirrors
        if(meshesObj.mirrorsNorth) {
            meshesObj.mirrorsNorth.rotation.y = Math.sin(t * 0.2) * 0.05;
        }
        if(meshesObj.mirrorsSouth) {
            meshesObj.mirrorsSouth.rotation.y = Math.cos(t * 0.2) * 0.05;
        }

        // 5. Spin magnetic docking rings independently
        if(meshesObj.dockingRings) {
            meshesObj.dockingRings.forEach(ring => {
                ring.rotation.z += speed * 0.01;
            });
        }

        // 6. Animate hydraulic docking arms (extending and retracting)
        if(meshesObj.hydraulics) {
            meshesObj.hydraulics.forEach(hyd => {
                const extension = Math.sin(t * 2 + hyd.timeOffset) * 20;
                hyd.inner.position.z = hyd.baseZ + extension;
                hyd.grabber.position.z = 120 + extension;
            });
        }
    }

    return {
        group,
        parts,
        description: "A hyper-realistic, massively detailed Bernal Sphere space habitat. Features include a spinning main habitation hull with internal terraformed biomes, complex external agricultural toruses, massive angled solar mirrors for natural light, extreme copper radiator arrays, and zero-gravity docking hubs powered by pulsing plasma thrusters and active hydraulic systems.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}
