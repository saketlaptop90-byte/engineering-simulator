import { titanium, gold, glass } from '../utils/materials.js';

export function createAlcubierreDrive(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    // Core ship
    const coreGeometry = new THREE.CylinderGeometry(2, 2, 20, 32);
    const core = new THREE.Mesh(coreGeometry, titanium);
    core.rotation.z = Math.PI / 2;
    group.add(core);

    // Warp rings
    const ring1Geo = new THREE.TorusGeometry(8, 1, 32, 100);
    const ring1 = new THREE.Mesh(ring1Geo, gold);
    ring1.position.x = -5;
    ring1.rotation.y = Math.PI / 2;
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(8, 1, 32, 100);
    const ring2 = new THREE.Mesh(ring2Geo, gold);
    ring2.position.x = 5;
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);

    // Animation: Rings rotating
    const trackName1 = ring1.uuid + '.rotation[z]';
    const trackName2 = ring2.uuid + '.rotation[z]';
    
    const times = [0, 2, 4];
    const values1 = [0, Math.PI, Math.PI * 2];
    const values2 = [0, -Math.PI, -Math.PI * 2];
    
    const track1 = new THREE.NumberKeyframeTrack(trackName1, times, values1);
    const track2 = new THREE.NumberKeyframeTrack(trackName2, times, values2);
    
    const clip = new THREE.AnimationClip('WarpRings', -1, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
