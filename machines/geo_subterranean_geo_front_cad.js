import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const bedrockMat = new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.1, roughness: 0.9 }); // Surrounding rock
    const armorPlateMat = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.8, roughness: 0.5 }); // High-tensile steel iris doors
    const habitatMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.2, roughness: 0.7 }); // Concrete/composite city blocks
    const ventShaftMat = new THREE.MeshPhysicalMaterial({ color: 0x777777, metalness: 0.7, roughness: 0.6 }); // Industrial ventilation pipes
    
    // VFX Materials
    const artificialSunVFX = new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Central daylight simulator
    const cityLightsVFX = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0.0 }); // Tiny glowing windows
    const ventSteamVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Air scrubbers

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.irisLeaves = [];
    group.userData.animatedMeshes.sun = null;
    group.userData.animatedMeshes.cityBlocks = [];
    group.userData.animatedMeshes.steam = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Subterranean Cavern
    // ==========================================
    const cavernGroup = new THREE.Group();
    
    // We model a massive spherical cavity carved into the bedrock
    // Cut open to see inside
    const cavityGeo = new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI, 0, Math.PI);
    const cavity = new THREE.Mesh(cavityGeo, bedrockMat);
    // Reverse normals so it's a hollow shell
    cavity.material.side = THREE.BackSide;
    cavernGroup.add(cavity);
    
    // Massive ventilation shafts punching through the roof
    for(let i=0; i<4; i++) {
        const angle = (i * Math.PI) / 4; // Only front half
        const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.0), ventShaftMat);
        vent.position.set(1.5 * Math.cos(angle), 2.0, 1.5 * Math.sin(angle));
        vent.lookAt(0,0,0); // Point towards center
        cavernGroup.add(vent);
        
        // Steam VFX at the vent exits
        const steam = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), ventSteamVFX);
        steam.position.set(1.5 * Math.cos(angle), 1.0, 1.5 * Math.sin(angle));
        cavernGroup.add(steam);
        group.userData.animatedMeshes.steam.push(steam);
    }
    
    group.add(cavernGroup);
    parts.push({ mesh: cavity, name: "Subterranean Geode Cavity", description: "Kilometer-scale excavated bedrock.", function: "Provides a massively fortified, climate-controlled environment capable of sheltering millions of citizens deep underground."});

    // ==========================================
    // 2. PROCEDURAL CAD: Surface Armor Iris Doors
    // ==========================================
    const irisGroup = new THREE.Group();
    irisGroup.position.set(0, 2.5, 0); // At the very top (surface level)
    
    const numLeaves = 8;
    for(let i=0; i<numLeaves; i++) {
        const leafGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / numLeaves;
        
        leafGroup.rotation.y = -angle;
        
        // The thick armor plate (shaped like a slice of pie)
        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.lineTo(1.5, 0.5);
        leafShape.lineTo(1.5, -0.5);
        leafShape.lineTo(0, 0);
        
        const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
        const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
        
        const leaf = new THREE.Mesh(leafGeo, armorPlateMat);
        // Position it so the point is at the center when closed
        leaf.position.set(0, 0, 0);
        leaf.rotation.x = Math.PI/2;
        
        leafGroup.add(leaf);
        irisGroup.add(leafGroup);
        
        // Store for animation (sliding outwards and rotating to open)
        group.userData.animatedMeshes.irisLeaves.push(leafGroup);
    }
    
    group.add(irisGroup);
    parts.push({ mesh: irisGroup.children[0], name: "Heavy Armor Iris Sequence", description: "Multi-layered interlocking blast doors.", function: "Seals the Geo-Front from orbital strikes, extreme surface weather, or contamination. Retracts to allow natural light or massive spacecraft deployment."});

    // ==========================================
    // 3. PROCEDURAL CAD: Habitat Tiers & Artificial Sun
    // ==========================================
    const cityGroup = new THREE.Group();
    
    // Central Artificial Sun (Daylight Simulator)
    const sun = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.0), artificialSunVFX);
    cityGroup.add(sun);
    group.userData.animatedMeshes.sun = sun;
    
    // Tiered habitat rings built into the walls of the geode
    for(let tier=0; tier<4; tier++) {
        const yPos = -1.5 + (tier * 0.8);
        const radius = Math.sqrt(2.5*2.5 - yPos*yPos) - 0.2; // Match cavity curve
        
        // We will represent city blocks as small clustered boxes on these rings
        const numBlocks = Math.floor(radius * 12); // More blocks on wider rings
        
        for(let i=0; i<numBlocks; i++) {
            // Only front half (0 to PI) since cavity is cut open
            const angle = (i * Math.PI) / numBlocks;
            const blockHeight = 0.2 + (Math.random() * 0.4);
            
            // Physical block
            const block = new THREE.Mesh(new THREE.BoxGeometry(0.1, blockHeight, 0.1), habitatMat);
            block.position.set(radius * Math.cos(angle), yPos + blockHeight/2, radius * Math.sin(angle));
            block.lookAt(0, yPos, 0);
            cityGroup.add(block);
            
            // City lights overlay (slightly larger, transparent)
            const light = new THREE.Mesh(new THREE.BoxGeometry(0.11, blockHeight*0.9, 0.11), cityLightsVFX);
            light.position.copy(block.position);
            light.rotation.copy(block.rotation);
            cityGroup.add(light);
            group.userData.animatedMeshes.cityBlocks.push(light);
        }
    }
    
    group.add(cityGroup);
    parts.push({ mesh: cityGroup.children[1], name: "Tiered Arcology Habitats", description: "High-density subterranean city blocks.", function: "Integrated residential, agricultural, and industrial sectors built directly into the cavern walls, illuminated by the central daylight simulator."});

    // Scale adjustment
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Iris Doors Open smoothly
            const openAmount = Math.min(1.0, state.throttle); // 0 to 1 based on throttle
            group.userData.animatedMeshes.irisLeaves.forEach((leaf, idx) => {
                // Slide back and rotate slightly to stack
                leaf.position.x = Math.cos(-idx * Math.PI * 2 / numLeaves) * (1.2 * openAmount);
                leaf.position.z = Math.sin(-idx * Math.PI * 2 / numLeaves) * (1.2 * openAmount);
                // The geometry inside the group doesn't rotate relative to the center unless we rotate the group
                leaf.rotation.y = (-idx * Math.PI * 2 / numLeaves) - (0.2 * openAmount);
            });
            
            // 2. Artificial Sun flares up
            group.userData.animatedMeshes.sun.material.opacity = 0.7 * speed;
            group.userData.animatedMeshes.sun.scale.set(1.0 + (Math.sin(timeAcc * 2) * 0.1), 1.0, 1.0 + (Math.sin(timeAcc * 2) * 0.1));
            
            // 3. City Lights flicker on (Night vs Day mode)
            // If doors are open (throttle high), city lights dim. If doors closed (throttle low but > 0), lights bright.
            const lightIntensity = 1.0 - (openAmount * 0.5); // 0.5 to 1.0
            group.userData.animatedMeshes.cityBlocks.forEach(block => {
                // Random flicker for some windows
                if (Math.random() < 0.05) {
                    block.material.opacity = lightIntensity * (0.5 + Math.random()*0.5);
                }
            });
            
            // 4. Vent shafts puff steam
            group.userData.animatedMeshes.steam.forEach(steam => {
                steam.material.opacity = 0.3 * speed;
                steam.scale.setScalar(1.0 + (Math.sin(timeAcc * 5 * speed + steam.position.x) * 0.2));
            });
            
        } else {
            // Idle (Closed, dark)
            group.userData.animatedMeshes.irisLeaves.forEach((leaf, idx) => {
                leaf.position.set(0,0,0);
                leaf.rotation.y = (-idx * Math.PI * 2 / numLeaves);
            });
            group.userData.animatedMeshes.sun.material.opacity = 0.0;
            group.userData.animatedMeshes.cityBlocks.forEach(block => block.material.opacity = 0.0);
            group.userData.animatedMeshes.steam.forEach(steam => steam.material.opacity = 0.0);
        }
    };

    group.userData.parts = parts;
    return group;
}
