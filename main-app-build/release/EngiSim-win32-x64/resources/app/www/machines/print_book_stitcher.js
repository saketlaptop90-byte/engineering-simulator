import { materials } from '../utils/materials.js';

export function createBookStitcher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base platform
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials?.steel || new THREE.MeshStandardMaterial({color: 0x888888}));
    base.position.y = 0.25;
    group.add(base);

    // Stitching Head Group
    const headGroup = new THREE.Group();
    headGroup.name = "StitchingHead";
    headGroup.position.set(0, 2, 0);
    group.add(headGroup);

    const headBaseGeo = new THREE.BoxGeometry(1, 1, 1);
    const headBase = new THREE.Mesh(headBaseGeo, materials?.aluminum || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    headGroup.add(headBase);

    // Needle
    const needleGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const needle = new THREE.Mesh(needleGeo, materials?.chrome || new THREE.MeshStandardMaterial({color: 0xffffff}));
    needle.position.y = -0.5;
    headGroup.add(needle);

    // Animate stitching head position
    const times = [0, 0.5, 1];
    const values = [0, 2, 0,   0, 1, 0,   0, 2, 0];
    const track = new THREE.VectorKeyframeTrack('StitchingHead.position', times, values);
    
    const clip = new THREE.AnimationClip('stitch', 1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
