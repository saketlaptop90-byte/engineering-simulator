import * as THREE from 'three';

export function createLithiumMedicalUse(scene, renderer, camera) {
    const group = new THREE.Group();

    // Represents Lithium Carbonate (Li2CO3) acting on a neural synapse
    // Bipolar disorder treatment visualization
    
    // Brain / Synapse Background (Abstract)
    const synapseGeo = new THREE.CylinderGeometry(1, 4, 10, 32, 1, true);
    const synapseMat = new THREE.MeshPhysicalMaterial({
        color: 0x221155,
        emissive: 0x110033,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const synapseTop = new THREE.Mesh(synapseGeo, synapseMat);
    synapseTop.position.y = 6;
    group.add(synapseTop);
    
    const synapseBottom = new THREE.Mesh(synapseGeo, synapseMat);
    synapseBottom.rotation.z = Math.PI;
    synapseBottom.position.y = -6;
    group.add(synapseBottom);

    // Neurotransmitters (overactive signals)
    const neuroGeo = new THREE.TetrahedronGeometry(0.3, 1);
    const neuroMat = new THREE.MeshPhongMaterial({
        color: 0xffff00,
        emissive: 0x888800,
        shininess: 100
    });
    
    const neuroCount = 40;
    const neurotransmitters = [];
    for(let i=0; i<neuroCount; i++) {
        const mesh = new THREE.Mesh(neuroGeo, neuroMat);
        mesh.userData = {
            progress: Math.random(),
            speed: Math.random() * 0.02 + 0.01,
            startX: (Math.random() - 0.5) * 4,
            startZ: (Math.random() - 0.5) * 4,
            endX: (Math.random() - 0.5) * 4,
            endZ: (Math.random() - 0.5) * 4
        };
        group.add(mesh);
        neurotransmitters.push(mesh);
    }

    // Lithium Ions (Li+) intercepting and regulating
    const liGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const liMat = new THREE.MeshPhysicalMaterial({
        color: 0xff3366,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x440011,
        clearcoat: 1.0
    });
    
    const liCount = 15;
    const lithiumIons = [];
    for(let i=0; i<liCount; i++) {
        const mesh = new THREE.Mesh(liGeo, liMat);
        // Add a plus sign to represent +1 charge
        const plusGeo = new THREE.BoxGeometry(0.6, 0.1, 0.1);
        const plusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const hLine = new THREE.Mesh(plusGeo, plusMat);
        const vLine = new THREE.Mesh(plusGeo, plusMat);
        vLine.rotation.z = Math.PI/2;
        mesh.add(hLine);
        mesh.add(vLine);
        
        mesh.userData = {
            theta: Math.random() * Math.PI * 2,
            radius: Math.random() * 3 + 1,
            speed: (Math.random() - 0.5) * 0.05
        };
        
        mesh.position.y = (Math.random() - 0.5) * 4;
        group.add(mesh);
        lithiumIons.push(mesh);
    }
    
    // Calming field aura
    const auraGeo = new THREE.SphereGeometry(4, 32, 32);
    const auraMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.1,
        transmission: 1.0,
        ior: 1.2
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    group.add(aura);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    light.position.set(0, 0, 0);
    group.add(light);
    
    group.add(new THREE.AmbientLight(0x222244));

    let time = 0;

    return {
        update: () => {
            time += 0.01;
            
            // Pulse the synapse
            synapseTop.scale.x = 1 + Math.sin(time * 2) * 0.05;
            synapseTop.scale.z = 1 + Math.sin(time * 2) * 0.05;
            synapseBottom.scale.x = 1 + Math.cos(time * 2) * 0.05;
            synapseBottom.scale.z = 1 + Math.cos(time * 2) * 0.05;
            
            // Aura breathes
            aura.scale.setScalar(1 + Math.sin(time) * 0.1);
            auraMat.opacity = 0.1 + Math.sin(time) * 0.05;

            // Neurotransmitters rush across the gap (top to bottom)
            neurotransmitters.forEach(mesh => {
                const data = mesh.userData;
                data.progress += data.speed;
                if(data.progress > 1) {
                    data.progress = 0;
                    data.startX = (Math.random() - 0.5) * 4;
                    data.startZ = (Math.random() - 0.5) * 4;
                    data.endX = (Math.random() - 0.5) * 4;
                    data.endZ = (Math.random() - 0.5) * 4;
                }
                
                mesh.position.y = 5 - (data.progress * 10);
                mesh.position.x = data.startX + (data.endX - data.startX) * data.progress;
                mesh.position.z = data.startZ + (data.endZ - data.startZ) * data.progress;
                
                mesh.rotation.x += 0.05;
                mesh.rotation.y += 0.05;
                
                // If inside the calming aura (y approx -3 to 3), slow them down
                if(mesh.position.y > -3 && mesh.position.y < 3) {
                    mesh.material.emissiveIntensity = 0.2; // Dim down (regulated)
                } else {
                    mesh.material.emissiveIntensity = 1.0; // Overactive
                }
            });
            
            // Lithium ions circulating to regulate the flow
            lithiumIons.forEach((mesh, i) => {
                const data = mesh.userData;
                data.theta += data.speed;
                
                mesh.position.x = Math.cos(data.theta) * data.radius;
                mesh.position.z = Math.sin(data.theta) * data.radius;
                
                // Bob up and down
                mesh.position.y += Math.sin(time * 3 + i) * 0.01;
                
                // Rotate to always face camera
                mesh.lookAt(camera.position);
            });
        },
        cleanup: () => {
            synapseGeo.dispose();
            synapseMat.dispose();
            neuroGeo.dispose();
            neuroMat.dispose();
            liGeo.dispose();
            liMat.dispose();
            auraGeo.dispose();
            auraMat.dispose();
        }
    };
}