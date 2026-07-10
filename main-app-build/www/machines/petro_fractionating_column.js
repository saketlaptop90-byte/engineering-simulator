import { materials } from '../utils/materials.js';

export function createFractionatingColumn(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main column
    const columnGeo = new THREE.CylinderGeometry(2, 2, 20, 32);
    const columnMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const column = new THREE.Mesh(columnGeo, columnMat);
    group.add(column);

    // Trays
    for (let i = -8; i <= 8; i += 2) {
        const trayGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.1, 32);
        const trayMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 });
        const tray = new THREE.Mesh(trayGeo, trayMat);
        tray.position.y = i;
        group.add(tray);
    }

    // Vapor animation
    const vaporTracks = [];
    for(let i=0; i<10; i++) {
        const vaporGeo = new THREE.SphereGeometry(0.5, 8, 8);
        const vaporMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const vapor = new THREE.Mesh(vaporGeo, vaporMat);
        vapor.position.set(Math.random() * 2 - 1, -9 + Math.random() * 2, Math.random() * 2 - 1);
        vapor.name = `vapor_${i}`;
        group.add(vapor);

        const times = [0, 2, 4];
        const values = [
            vapor.position.x, -9, vapor.position.z,
            vapor.position.x, 0, vapor.position.z,
            vapor.position.x, 9, vapor.position.z
        ];
        const positionTrack = new THREE.VectorKeyframeTrack(`${vapor.name}.position`, times, values);
        vaporTracks.push(positionTrack);
    }

    const clip = new THREE.AnimationClip('VaporRising', 4, vaporTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
