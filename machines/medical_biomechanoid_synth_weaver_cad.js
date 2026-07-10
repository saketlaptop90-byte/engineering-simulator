import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const bioChamberGlass = new THREE.MeshPhysicalMaterial({ color: 0xaaffaa, metalness: 0.1, roughness: 0.0, transmission: 0.9, thickness: 0.3 }); // Sterile growth chamber
    const surgicalSteel = new THREE.MeshPhysicalMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }); // Robotic arms and spinnerets
    const nutrientFluid = new THREE.MeshPhysicalMaterial({ color: 0xff4444, metalness: 0.0, roughness: 0.2, transmission: 0.8, thickness: 0.5 }); // Oxygenated synthetic blood
    const syntheticTissue = new THREE.MeshPhysicalMaterial({ color: 0xffaaaa, metalness: 0.0, roughness: 0.8 }); // The printed biomaterial
    
    // VFX Materials
    const laserScannerVFX = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Topography scanner
    const proteinExtrusionVFX = new THREE.MeshBasicMaterial({ color: 0xffcccc, transparent: true, opacity: 0.0 }); // Fluid leaving the nozzle
    const vatBubblesVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Oxygenation bubbles

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.spinnerets = [];
    group.userData.animatedMeshes.extrusion = [];
    group.userData.animatedMeshes.scanner = null;
    group.userData.animatedMeshes.tissue = null;
    group.userData.animatedMeshes.bubbles = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Bioreactor & Nutrient Vats
    // ==========================================
    const reactorGroup = new THREE.Group();
    
    // The main sterile growth chamber
    const chamber = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.0, 32), bioChamberGlass);
    reactorGroup.add(chamber);
    
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32), surgicalSteel);
    basePlate.position.y = -1.1;
    reactorGroup.add(basePlate);
    
    // Nutrient supply vats attached to the sides
    for(let side of [-1, 1]) {
        const vat = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16), bioChamberGlass);
        vat.position.set(side * 1.8, 0, 0);
        
        // Liquid inside the vat
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 1.2, 16), nutrientFluid);
        liquid.position.set(side * 1.8, -0.1, 0);
        reactorGroup.add(vat, liquid);
        
        // Fluid pump and piping
        const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3).rotateX(Math.PI/2), surgicalSteel);
        pump.position.set(side * 1.8, -0.9, 0.4);
        reactorGroup.add(pump);
        
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0).rotateZ(Math.PI/2), surgicalSteel);
        pipe.position.set(side * 1.3, -0.9, 0.4);
        reactorGroup.add(pipe);
    }
    
    // Oxygenation bubbles in the vats (VFX)
    for(let i=0; i<30; i++) {
        const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), vatBubblesVFX);
        bubble.userData = { t: Math.random(), side: Math.random() > 0.5 ? 1 : -1, speed: 0.5 + Math.random() };
        reactorGroup.add(bubble);
        group.userData.animatedMeshes.bubbles.push(bubble);
    }
    
    group.add(reactorGroup);
    parts.push({ mesh: chamber, name: "Sterile Bioreactor Chamber", description: "Class-100 cleanroom glass enclosure.", function: "Provides a perfectly sterile, temperature-controlled environment for growing and weaving live synthetic tissues."});

    // ==========================================
    // 2. PROCEDURAL CAD: Robotic Spinnerets & Scanners
    // ==========================================
    // Suspended from the ceiling of the chamber
    const roboticsGroup = new THREE.Group();
    roboticsGroup.position.y = 0.9;
    
    // Central rotational mount
    const ceilingMount = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1), surgicalSteel);
    roboticsGroup.add(ceilingMount);
    
    // 3 Articulated Spinneret Arms
    for(let i=0; i<3; i++) {
        const armGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 3;
        armGroup.rotation.y = angle;
        
        // Shoulder
        const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.1), surgicalSteel);
        shoulder.position.set(0.3, -0.1, 0);
        armGroup.add(shoulder);
        
        // Upper arm (angling inwards)
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), surgicalSteel);
        upper.position.set(0.15, -0.4, 0);
        upper.rotation.z = Math.PI/6;
        armGroup.add(upper);
        
        // The micro-extrusion nozzle (Spinneret)
        const nozzle = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 16), chrome);
        nozzle.position.set(0, -0.7, 0);
        nozzle.rotation.z = -Math.PI/6; // Point down
        armGroup.add(nozzle);
        
        // Extrusion VFX (Liquid protein thread leaving the nozzle)
        const thread = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.2), proteinExtrusionVFX);
        thread.position.set(0, -0.8, 0);
        armGroup.add(thread);
        group.userData.animatedMeshes.extrusion.push(thread);
        
        roboticsGroup.add(armGroup);
        group.userData.animatedMeshes.spinnerets.push(armGroup);
    }
    
    // Topography Laser Scanner (sweeps over the growing tissue)
    const scanner = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.05), laserScannerVFX);
    scanner.rotation.x = Math.PI/2;
    scanner.position.y = -0.5;
    roboticsGroup.add(scanner);
    group.userData.animatedMeshes.scanner = scanner;
    
    group.add(roboticsGroup);
    parts.push({ mesh: roboticsGroup.children[1].children[2], name: "Protein Extrusion Spinnerets", description: "Sub-millimeter articulated robotic nozzles.", function: "Weaves intricate microscopic patterns of live cells and protein scaffolds, mimicking the complex vascular networks of human organs."});

    // ==========================================
    // 3. PROCEDURAL CAD: The Synthetic Tissue
    // ==========================================
    // The organ/tissue being printed on the base plate
    const tissueGroup = new THREE.Group();
    tissueGroup.position.y = -1.0;
    
    // We'll represent the tissue as a highly segmented organic shape that "grows"
    const tissueGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI*2, 0, Math.PI/2);
    const tissue = new THREE.Mesh(tissueGeo, syntheticTissue);
    tissue.scale.y = 0.1; // Starts flat
    tissueGroup.add(tissue);
    group.userData.animatedMeshes.tissue = tissue;
    
    group.add(tissueGroup);

    // Scale adjustment
    group.scale.set(0.6, 0.6, 0.6);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    let tissueProgress = 0.1; // From 0.1 (flat) to 1.0 (full hemisphere)
    
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Oxygenation bubbles rise in the vats
            group.userData.animatedMeshes.bubbles.forEach(bubble => {
                bubble.userData.t += 0.02 * speed * bubble.userData.speed;
                if (bubble.userData.t > 1.0) bubble.userData.t = 0.0;
                
                const side = bubble.userData.side;
                // Vats are at x = +/- 1.8, y from -0.7 to +0.5
                bubble.position.x = side * 1.8 + (Math.sin(timeAcc * 10 + bubble.userData.t * 20) * 0.1);
                bubble.position.y = -0.7 + (bubble.userData.t * 1.2);
                bubble.position.z = (Math.cos(timeAcc * 12 + bubble.userData.t * 20) * 0.1);
                
                bubble.material.opacity = 0.6 * speed;
            });
            
            // 2. Robotic Spinnerets weave
            // They rotate around the center, and flex slightly
            const currentHeight = -1.0 + (tissueProgress * 0.5); // Top of the tissue
            group.userData.animatedMeshes.spinnerets.forEach((arm, index) => {
                // Spin around central axis
                arm.rotation.y += 2.0 * speed;
                
                // Adjust arm reach based on tissue height
                const flex = Math.sin(timeAcc * 5.0 + index) * 0.1;
                arm.children[1].rotation.z = (Math.PI/6) + flex;
                
                // Extrusion thread opacity
                group.userData.animatedMeshes.extrusion[index].material.opacity = 0.8;
            });
            
            // 3. Laser Scanner sweeps back and forth
            group.userData.animatedMeshes.scanner.material.opacity = 0.5;
            group.userData.animatedMeshes.scanner.position.z = Math.sin(timeAcc * 2.0 * speed) * 0.6;
            
            // 4. The Synthetic Tissue physically GROWS over time
            tissueProgress += 0.02 * speed;
            if (tissueProgress > 1.0) tissueProgress = 0.1; // Reset when complete
            
            // Scale the tissue mesh up
            group.userData.animatedMeshes.tissue.scale.y = tissueProgress;
            // Add a slight pulsing/beating to the organic tissue
            const pulse = 1.0 + (Math.sin(timeAcc * 15 * speed) * 0.02);
            group.userData.animatedMeshes.tissue.scale.x = pulse;
            group.userData.animatedMeshes.tissue.scale.z = pulse;
            
        } else {
            // Idle
            group.userData.animatedMeshes.bubbles.forEach(b => b.material.opacity = 0);
            group.userData.animatedMeshes.extrusion.forEach(e => e.material.opacity = 0);
            group.userData.animatedMeshes.scanner.material.opacity = 0;
            group.userData.animatedMeshes.tissue.scale.set(1, tissueProgress, 1);
        }
    };

    group.userData.parts = parts;
    return group;
}
