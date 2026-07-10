import { materials } from '../utils/materials.js';

export function createDataCenterRackSwitch(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const chassisMat = (materials && materials.darkMetal) || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
    const portMat = (materials && materials.metal) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.5 });
    const ledMat = (materials && materials.emissiveGreen) || new THREE.MeshStandardMaterial({ emissive: 0x00ff00, emissiveIntensity: 1, color: 0x000000 });

    const chassisGeo = new THREE.BoxGeometry(4.8, 0.44, 3);
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    group.add(chassis);

    const tracks = [];
    for (let i=0; i<24; i++) {
        const portGeo = new THREE.BoxGeometry(0.12, 0.12, 0.1);
        const port = new THREE.Mesh(portGeo, portMat);
        const px = -2.2 + (i % 12) * 0.18 + (Math.floor(i % 12 / 4) * 0.1);
        const py = i < 12 ? 0.08 : -0.08;
        port.position.set(px, py, 1.5);
        group.add(port);

        const ledGeo = new THREE.PlaneGeometry(0.04, 0.04);
        const ledMatClone = ledMat.clone();
        const led = new THREE.Mesh(ledGeo, ledMatClone);
        led.position.set(px, py + 0.1, 1.51);
        led.name = `led_${i}`;
        group.add(led);

        const blinkTimes = [0, 0.2 + Math.random()*0.5, 1.0];
        const blinkValues = [1, 0, 1];
        tracks.push(new THREE.NumberKeyframeTrack(`${led.name}.material.emissiveIntensity`, blinkTimes, blinkValues));
    }

    const clip = new THREE.AnimationClip('BlinkingLights', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
