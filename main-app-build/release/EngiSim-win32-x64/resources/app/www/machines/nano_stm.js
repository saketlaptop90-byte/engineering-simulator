import { materials } from '../utils/materials.js';

export function createScanningTunnelingMicroscope(THREE) {
    const group = new THREE.Group();
    group.name = 'STM';

    // Base platform
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const baseMat = materials.metallic || new THREE.MeshStandardMaterial({color: 0x666666});
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Tip holder
    const holderGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const holderMat = materials.accent || new THREE.MeshStandardMaterial({color: 0xaa2222});
    const holder = new THREE.Mesh(holderGeo, holderMat);
    holder.position.y = 1.5;
    holder.name = 'STMTipHolder';
    group.add(holder);

    // Scanning tip
    const tipGeo = new THREE.ConeGeometry(0.1, 1, 16);
    const tipMat = materials.highlight || new THREE.MeshStandardMaterial({color: 0xffd700, metalness: 1.0});
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = -1.5;
    tip.name = 'STMTip';
    holder.add(tip);

    // Animation (scanning back and forth over the sample)
    const times = [0, 1, 2, 3, 4];
    const values = [
        -1, 1.5, -1,
         1, 1.5, -1,
         1, 1.5,  1,
        -1, 1.5,  1,
        -1, 1.5, -1
    ];
    const posTrack = new THREE.VectorKeyframeTrack('STMTipHolder.position', times, values);
    const clip = new THREE.AnimationClip('ScanSurface', 4, [posTrack]);

    return { group, animationClips: [clip] };
}
