import * as THREE from 'three';

export function createBerylliumElectronProtonInteraction(scene, renderer, camera) {
    const group = new THREE.Group();

    // Show electromagnetic interaction:
    // 4 Protons in center pulling on 4 Electrons
    // We will draw force vectors (arrows) from electrons to nucleus

    // Nucleus
    const nucleusGroup = new THREE.Group();
    group.add(nucleusGroup);

    const protonGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const protonMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    for(let i=0; i<4; i++) {
        const p = new THREE.Mesh(protonGeo, protonMat);
        p.position.set(
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8,
            (Math.random()-0.5)*0.8
        );
        nucleusGroup.add(p);
    }

    // Electrons & Force Arrows
    const electronGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    
    const electrons = [];
    
    // 2 in inner orbit, 2 in outer orbit
    const orbits = [2.0, 2.0, 4.0, 4.0];
    
    orbits.forEach((radius, i) => {
        const e = new THREE.Mesh(electronGeo, electronMat);
        group.add(e);
        
        // Arrow Helper to show attractive force
        const dir = new THREE.Vector3(0, -1, 0);
        const origin = new THREE.Vector3(0, radius, 0);
        const length = radius - 0.5;
        const hex = 0xffaa00;
        
        const arrow = new THREE.ArrowHelper(dir, origin, length, hex, 0.4, 0.2);
        
        // Customizing arrow lines to look cooler
        arrow.line.material.linewidth = 2;
        arrow.line.material.transparent = true;
        arrow.line.material.opacity = 0.6;
        
        group.add(arrow);
        
        electrons.push({
            mesh: e,
            arrow: arrow,
            radius: radius,
            angle: Math.random() * Math.PI * 2,
            speed: 0.02 + (1.0 / radius) * 0.02,
            euler: new THREE.Euler(Math.random(), Math.random(), Math.random())
        });
    });

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            nucleusGroup.rotation.y = time * 0.5;

            electrons.forEach(e => {
                e.angle += e.speed;
                
                // Position
                const pos = new THREE.Vector3(Math.cos(e.angle)*e.radius, Math.sin(e.angle)*e.radius, 0);
                pos.applyEuler(e.euler);
                e.mesh.position.copy(pos);
                
                // Update Arrow (points from electron to nucleus)
                const dirToNucleus = new THREE.Vector3().subVectors(new THREE.Vector3(0,0,0), pos).normalize();
                e.arrow.position.copy(pos);
                e.arrow.setDirection(dirToNucleus);
                
                // Pulse arrow length and opacity
                const pulse = Math.sin(time * 10 + e.angle) * 0.2;
                e.arrow.setLength(e.radius - 0.5 + pulse, 0.4, 0.2);
                e.arrow.line.material.opacity = 0.5 + pulse;
            });
            
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            protonGeo.dispose();
            protonMat.dispose();
            electronGeo.dispose();
            electronMat.dispose();
            electrons.forEach(e => {
                e.arrow.line.geometry.dispose();
                e.arrow.cone.geometry.dispose();
            });
        }
    };
}