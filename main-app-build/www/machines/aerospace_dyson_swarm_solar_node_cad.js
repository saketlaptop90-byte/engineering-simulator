import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const spaceFrameTruss = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, metalness: 0.9, roughness: 0.3 }); // Carbon nanotube struts
    const metamaterialSail = new THREE.MeshPhysicalMaterial({ color: 0xffaa22, metalness: 1.0, roughness: 0.1, transmission: 0.2, thickness: 0.01 }); // Ultra-thin solar collector
    const phasedArrayPlate = new THREE.MeshPhysicalMaterial({ color: 0x334455, metalness: 0.6, roughness: 0.8 }); // Microwave emitter face
    const thrusterHousing = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.5 }); // Ion engine bells
    
    // VFX Materials
    const sunReflectionVFX = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Specular glare from the sun
    const microwaveBeamVFX = new THREE.MeshBasicMaterial({ color: 0xaa55ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Power beaming to Earth
    const ionPlumeVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Station-keeping thrusters

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.sails = [];
    group.userData.animatedMeshes.microwaveBeam = null;
    group.userData.animatedMeshes.thrusters = [];
    group.userData.animatedMeshes.glare = null;

    // ==========================================
    // 1. PROCEDURAL CAD: Solar Collector Sails & Truss
    // ==========================================
    const arrayGroup = new THREE.Group();
    
    // Central hexagonal hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 6), spaceFrameTruss);
    hub.rotation.x = Math.PI/2;
    arrayGroup.add(hub);
    
    // 6 massive unfolding petal sails
    for(let i=0; i<6; i++) {
        const petalGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 6;
        petalGroup.rotation.z = angle;
        
        // Structural boom extending outward
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.02, 4.0), spaceFrameTruss);
        boom.position.set(0, 2.0, 0);
        petalGroup.add(boom);
        
        // The metamaterial sail stretched between booms
        // We use a custom shape for the petal
        const shape = new THREE.Shape();
        shape.moveTo(-0.4, 0.5);
        shape.lineTo(0.4, 0.5);
        shape.lineTo(1.5, 3.8);
        shape.lineTo(-1.5, 3.8);
        shape.lineTo(-0.4, 0.5);
        
        const sailGeo = new THREE.ShapeGeometry(shape);
        const sail = new THREE.Mesh(sailGeo, metamaterialSail);
        sail.position.z = 0.02; // Slightly above boom
        petalGroup.add(sail);
        group.userData.animatedMeshes.sails.push(sail);
        
        arrayGroup.add(petalGroup);
    }
    
    // A glare plane sitting in front of the array to simulate catching the sun
    const glare = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), sunReflectionVFX);
    glare.position.z = 0.5;
    arrayGroup.add(glare);
    group.userData.animatedMeshes.glare = glare;
    
    group.add(arrayGroup);
    parts.push({ mesh: arrayGroup.children[1].children[1], name: "Metamaterial Solar Sail", description: "Ultra-thin carbon-lattice photovoltaic film.", function: "Unfurls to a span of several square kilometers to capture raw solar radiation with 99% thermodynamic efficiency."});

    // ==========================================
    // 2. PROCEDURAL CAD: Microwave Phased Array Transmitter
    // ==========================================
    // Beams the collected power to Earth or orbital receivers
    const transmitterGroup = new THREE.Group();
    transmitterGroup.position.set(0, 0, -0.2); // On the back side of the hub
    
    // The main transmitting dish/plate
    const txPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16).rotateX(Math.PI/2), phasedArrayPlate);
    transmitterGroup.add(txPlate);
    
    // Hundreds of individual klystron emitters (simplified as a grid pattern)
    for(let x=-0.6; x<=0.6; x+=0.15) {
        for(let y=-0.6; y<=0.6; y+=0.15) {
            if(x*x + y*y < 0.4) { // Only inside the circle
                const emitter = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.05), chrome);
                emitter.position.set(x, y, -0.1);
                transmitterGroup.add(emitter);
            }
        }
    }
    
    // The Microwave Power Beam VFX
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 10.0, 16).rotateX(Math.PI/2), microwaveBeamVFX);
    beam.position.z = -5.0; // Shooting backwards
    transmitterGroup.add(beam);
    group.userData.animatedMeshes.microwaveBeam = beam;
    
    group.add(transmitterGroup);
    parts.push({ mesh: txPlate, name: "Microwave Phased Array", description: "Massive solid-state RF emitter grid.", function: "Converts solar DC power into a tight microwave beam, transmitting gigawatts of clean energy wirelessly to rectenna farms on Earth."});

    // ==========================================
    // 3. PROCEDURAL CAD: Ion Station-Keeping Thrusters
    // ==========================================
    // Keeps the massive sail aligned with the sun
    const thrusterGroup = new THREE.Group();
    
    for(let i=0; i<3; i++) {
        const podGroup = new THREE.Group();
        const angle = (i * Math.PI * 2) / 3;
        podGroup.position.set(0.6 * Math.cos(angle), 0.6 * Math.sin(angle), 0);
        
        // Thruster housing
        const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.05, 0.2).rotateX(Math.PI/2), thrusterHousing);
        podGroup.add(bell);
        
        // Ion Plume VFX
        const plume = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.6).rotateX(Math.PI/2), ionPlumeVFX);
        plume.position.z = -0.3; // Pointing backwards for forward thrust
        podGroup.add(plume);
        group.userData.animatedMeshes.thrusters.push(plume);
        
        // Gimbal mount
        const gimbal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), chrome);
        gimbal.position.z = 0.1;
        podGroup.add(gimbal);
        
        thrusterGroup.add(podGroup);
    }
    
    group.add(thrusterGroup);
    parts.push({ mesh: thrusterGroup.children[0].children[0], name: "Hall-Effect Ion Thrusters", description: "Xenon electric propulsion pods.", function: "Fires continuously to counteract solar wind pressure and maintain precise orbital alignment within the millions-strong Dyson swarm."});

    // Scale adjustment
    group.scale.set(0.5, 0.5, 0.5);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Sails catch the sun
            group.userData.animatedMeshes.glare.material.opacity = 0.3 + (Math.sin(timeAcc * 2.0) * 0.1);
            // Sails ripple very slightly in the solar wind
            group.userData.animatedMeshes.sails.forEach((sail, index) => {
                sail.position.z = 0.02 + Math.sin(timeAcc * 3.0 + index) * 0.05 * speed;
            });
            
            // 2. Microwave Power Beam fires
            // Create a pulsing effect running down the beam
            group.userData.animatedMeshes.microwaveBeam.material.opacity = 0.6 + (Math.random() * 0.2);
            // We can scale it slightly to look like it's throbbing with power
            const pulse = 1.0 + (Math.sin(timeAcc * 30 * speed) * 0.05);
            group.userData.animatedMeshes.microwaveBeam.scale.set(pulse, 1.0, pulse);
            
            // 3. Ion Thrusters fire to maintain station
            group.userData.animatedMeshes.thrusters.forEach(plume => {
                plume.material.opacity = 0.8;
                plume.scale.z = 1.0 + (Math.random() * 0.5 * speed); // Flicker length
            });
            
            // The whole station slowly rotates to track the sun (simulated)
            group.rotation.z += 0.05 * speed;
            
        } else {
            // Idle
            group.userData.animatedMeshes.glare.material.opacity = 0;
            group.userData.animatedMeshes.sails.forEach(sail => sail.position.z = 0.02);
            group.userData.animatedMeshes.microwaveBeam.material.opacity = 0;
            group.userData.animatedMeshes.thrusters.forEach(plume => plume.material.opacity = 0);
            group.rotation.z *= 0.95;
        }
    };

    group.userData.parts = parts;
    return group;
}
