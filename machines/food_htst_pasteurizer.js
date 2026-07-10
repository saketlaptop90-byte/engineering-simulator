import { materials } from '../utils/materials.js';

export function createHTSTPasteurizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    group.add(base);

    const heatExchangerGroup = new THREE.Group();
    heatExchangerGroup.position.set(0, 1.5, 0);
    group.add(heatExchangerGroup);

    // Plates
    for (let i = 0; i < 10; i++) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2, 2), materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
        plate.position.set(-1.5 + i * 0.3, 0, 0);
        heatExchangerGroup.add(plate);
    }

    const pipeGeo = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
    const pipe1 = new THREE.Mesh(pipeGeo, materials.glass || new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 }));
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(0, 0.8, 1);
    heatExchangerGroup.add(pipe1);

    const pipe2 = new THREE.Mesh(pipeGeo, materials.glass || new THREE.MeshStandardMaterial({ color: 0xff8888, transparent: true, opacity: 0.5 }));
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(0, -0.8, -1);
    heatExchangerGroup.add(pipe2);

    // Indicator light
    const lightGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const light = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    light.name = "indicatorLight";
    light.position.set(1.5, 2.8, 0);
    group.add(light);

    // Animation: pulsing light color to simulate heating process
    const clip = new THREE.AnimationClip('Heating', 2, [
        new THREE.ColorKeyframeTrack('indicatorLight.material.color', [0, 1, 2], [1, 0, 0, 1, 0.5, 0, 1, 0, 0])
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
