import * as materials from '../utils/materials.js';

export function createLIDARRotatingScanner(THREE) {
    const group = new THREE.Group();

    const baseMat = materials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0x111111 });
    const spinnerMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const laserMat = materials.glowMaterial || new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 32), baseMat);
    group.add(base);

    const spinner = new THREE.Group();
    spinner.name = 'Spinner';
    spinner.position.y = 0.8;
    group.add(spinner);

    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 32), spinnerMat);
    spinner.add(head);

    const lens = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.9), baseMat);
    lens.position.z = 0.5;
    spinner.add(lens);

    const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 5), laserMat);
    laser.rotation.x = Math.PI / 2;
    laser.position.z = 3;
    spinner.add(laser);

    const times = [0, 1];
    const values = [0, Math.PI * 2];
    const spinTrack = new THREE.NumberKeyframeTrack(spinner.name + '.rotation[y]', times, values);

    const clip = new THREE.AnimationClip('scan', 1, [spinTrack]);

    return { group, animationClips: [clip] };
}
