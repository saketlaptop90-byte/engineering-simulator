import { materials } from '../utils/materials.js';

export function createDieselCrankshaft(THREE) {
    const group = new THREE.Group();
    group.name = 'crankshaftAssembly';
    const animationClips = [];

    const crankshaft = new THREE.Group();
    crankshaft.name = 'crankshaft';
    group.add(crankshaft);

    const crankCount = 6;
    const spacing = 4;

    for (let i = 0; i < crankCount; i++) {
        const mainJournalGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
        mainJournalGeo.rotateZ(Math.PI / 2);
        const mainJournal = new THREE.Mesh(mainJournalGeo, materials.steel);
        mainJournal.position.set(i * spacing - (crankCount * spacing) / 2, 0, 0);
        crankshaft.add(mainJournal);

        const webGeo = new THREE.BoxGeometry(1, 4, 2);
        const web1 = new THREE.Mesh(webGeo, materials.steel);
        const angle = (i * Math.PI * 2) / 3;
        web1.position.set(i * spacing - (crankCount * spacing) / 2 + 1, Math.sin(angle) * 2, Math.cos(angle) * 2);
        crankshaft.add(web1);

        const pinGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32);
        pinGeo.rotateZ(Math.PI / 2);
        const pin = new THREE.Mesh(pinGeo, materials.steel);
        pin.position.set(i * spacing - (crankCount * spacing) / 2 + 2, Math.sin(angle) * 4, Math.cos(angle) * 4);
        crankshaft.add(pin);
        
        const web2 = new THREE.Mesh(webGeo, materials.steel);
        web2.position.set(i * spacing - (crankCount * spacing) / 2 + 3, Math.sin(angle) * 2, Math.cos(angle) * 2);
        crankshaft.add(web2);
    }

    const rotationTrack = new THREE.NumberKeyframeTrack('crankshaft.rotation[x]', [0, 2], [0, Math.PI * 2]);
    const clip = new THREE.AnimationClip('CrankshaftRotation', 2, [rotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
