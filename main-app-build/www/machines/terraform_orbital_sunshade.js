import { materials } from '../utils/materials.js';

export function createOrbitalSunshade(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Core
    const coreGeo = new THREE.CylinderGeometry(10, 10, 50, 16);
    const core = new THREE.Mesh(coreGeo, materials.metallic || new THREE.MeshStandardMaterial({color: 0x444444}));
    group.add(core);

    // Mirror panels unfurling
    const panelGeo = new THREE.PlaneGeometry(30, 80);
    const panelMat = materials.glass || new THREE.MeshPhysicalMaterial({color: 0x88ccff, metalness: 0.9, roughness: 0.1, transmission: 0.5, transparent: true});
    panelGeo.translate(15, 0, 0); // pivot on edge
    
    const panels = [];
    for(let i=0; i<6; i++) {
        const panelGroup = new THREE.Group();
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.rotation.x = Math.PI / 2;
        panelGroup.add(panel);
        panelGroup.rotation.y = (i * Math.PI * 2) / 6;
        
        // Initial folded state
        panelGroup.rotation.z = Math.PI / 2;
        panelGroup.name = `panelGroup_${i}`;
        group.add(panelGroup);
        panels.push(panelGroup);
    }

    // Animation: Unfurl
    const times = [0, 5];
    const tracks = [];
    for(let i=0; i<6; i++) {
        const startQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (i * Math.PI * 2) / 6, Math.PI / 2));
        const endQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (i * Math.PI * 2) / 6, 0));
        const values = [
            startQ.x, startQ.y, startQ.z, startQ.w,
            endQ.x, endQ.y, endQ.z, endQ.w
        ];
        const track = new THREE.QuaternionKeyframeTrack(`panelGroup_${i}.quaternion`, times, values);
        tracks.push(track);
    }

    const unfurlClip = new THREE.AnimationClip('Unfurl', 5, tracks);
    animationClips.push(unfurlClip);

    return { group, animationClips };
}
