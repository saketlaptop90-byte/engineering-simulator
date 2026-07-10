import { aluminum, glass, titanium } from '../utils/materials.js';

export function createCryoStasisPod(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pod Base
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 8);
    const base = new THREE.Mesh(baseGeo, titanium);
    group.add(base);

    // Interior Bed
    const bedGeo = new THREE.BoxGeometry(2, 0.2, 7);
    const bed = new THREE.Mesh(bedGeo, aluminum);
    bed.position.y = 0.35;
    base.add(bed);

    // Glass Cover
    const coverGeo = new THREE.CylinderGeometry(1.5, 1.5, 7.5, 32, 1, false, 0, Math.PI);
    const cover = new THREE.Mesh(coverGeo, glass);
    cover.rotation.z = Math.PI / 2;
    cover.position.y = 0.5;
    cover.name = 'GlassCover';
    group.add(cover);

    // Control Panel
    const panelGeo = new THREE.BoxGeometry(1, 1, 0.2);
    const panel = new THREE.Mesh(panelGeo, titanium);
    panel.position.set(0, 1.5, 3.5);
    panel.rotation.x = -Math.PI / 6;
    group.add(panel);

    // Frost Effect Plane
    const frostGeo = new THREE.PlaneGeometry(2, 7);
    const frostMat = glass.clone();
    frostMat.transparent = true;
    frostMat.opacity = 0.0;
    const frost = new THREE.Mesh(frostGeo, frostMat); 
    frost.position.set(0, 1.8, 0);
    frost.rotation.x = -Math.PI / 2;
    frost.name = 'FrostPlane';
    group.add(frost);

    // Animation: Pod opening and freezing (opacity of frost increases)
    const coverRotTrack = new THREE.NumberKeyframeTrack('GlassCover.rotation[x]', [0, 2, 4, 6], [0, Math.PI/3, Math.PI/3, 0]);
    const frostTrack = new THREE.NumberKeyframeTrack('FrostPlane.material.opacity', [0, 2, 4, 6], [0.8, 0, 0, 0.8]);

    const freezeClip = new THREE.AnimationClip('CryoCycle', 6, [coverRotTrack, frostTrack]);
    animationClips.push(freezeClip);

    return { group, animationClips };
}
