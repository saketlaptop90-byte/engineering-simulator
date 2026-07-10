import { materials } from '../utils/materials.js';

export function createBlisterPacker(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeom = new THREE.BoxGeometry(4, 1, 2);
    const base = new THREE.Mesh(baseGeom, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    base.position.set(0, 0.5, 0);
    group.add(base);

    const formingGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const forming = new THREE.Mesh(formingGeom, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    forming.position.set(-1.2, 1.75, 0);
    group.add(forming);

    const sealingGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const sealing = new THREE.Mesh(sealingGeom, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    sealing.position.set(1.2, 1.75, 0);
    group.add(sealing);

    const rollGeom = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
    const roll = new THREE.Mesh(rollGeom, materials.plastic || new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    roll.rotation.x = Math.PI / 2;
    roll.position.set(-2.2, 1.5, 0);
    group.add(roll);

    const filmGeom = new THREE.PlaneGeometry(3, 1);
    const film = new THREE.Mesh(filmGeom, materials.glass || new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
    film.rotation.x = -Math.PI / 2;
    film.position.set(0, 1.2, 0);
    group.add(film);

    const stampGeom = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const stamp = new THREE.Mesh(stampGeom, materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 }));
    stamp.position.set(0, -0.6, 0);
    stamp.name = 'sealingStamp';
    sealing.add(stamp);

    const positionTrack = new THREE.VectorKeyframeTrack(
        'sealingStamp.position',
        [0, 0.5, 1, 1.5, 2],
        [0,-0.6,0,  0,-0.8,0,  0,-0.6,0,  0,-0.8,0,  0,-0.6,0]
    );

    const clip = new THREE.AnimationClip('SealAction', 2, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
