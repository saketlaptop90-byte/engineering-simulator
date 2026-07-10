import * as mats from '../utils/materials.js';

export function createActivatedSludgeAerator(THREE) {
    const materials = mats.materials || mats;
    const group = new THREE.Group();
    const animationClips = [];

    const matConcrete = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const matWater = materials.water || new THREE.MeshStandardMaterial({ color: 0x228833, transparent: true, opacity: 0.85 });
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.7, roughness: 0.3 });
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });

    // Aeration Basin
    const basinGeo = new THREE.BoxGeometry(20, 5, 10);
    // Create tank with open top
    const basin = new THREE.Mesh(basinGeo, matConcrete);
    basin.material.side = THREE.BackSide;
    group.add(basin);

    // Water volume
    const waterGeo = new THREE.BoxGeometry(19.8, 4.5, 9.8);
    const water = new THREE.Mesh(waterGeo, matWater);
    water.position.y = -0.2;
    group.add(water);

    // Diffuser Pipes at bottom
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 19.6, 8);
    for(let z = -4; z <= 4; z += 2) {
        const pipe = new THREE.Mesh(pipeGeo, matMetal);
        pipe.rotation.x = Math.PI / 2;
        pipe.position.set(0, -2.4, z);
        group.add(pipe);
    }

    // Bubbles
    const bubblesGroup = new THREE.Group();
    bubblesGroup.name = "BubblesGroup";
    group.add(bubblesGroup);

    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    
    // Create multiple bubble layers
    for (let i=0; i<3; i++) {
        const layer = new THREE.Group();
        layer.name = `BubbleLayer_${i}`;
        for (let j=0; j<50; j++) {
            const b = new THREE.Mesh(bubbleGeo, bubbleMat);
            b.position.set((Math.random()-0.5)*19, (Math.random()-0.5)*4.5, (Math.random()-0.5)*9);
            layer.add(b);
        }
        bubblesGroup.add(layer);
        
        // Animate each layer rising
        const track = new THREE.VectorKeyframeTrack(`${layer.name}.position`, [0, 2], [
            0, -2 + i, 0,
            0, 2 + i, 0
        ]);
        const scaleTrack = new THREE.VectorKeyframeTrack(`${layer.name}.scale`, [0, 2], [
            0.5, 0.5, 0.5,
            1.5, 1.5, 1.5
        ]);
        const clip = new THREE.AnimationClip(`BubblesRise_${i}`, 2, [track, scaleTrack]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
