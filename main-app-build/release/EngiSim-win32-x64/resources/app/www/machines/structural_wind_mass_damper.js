import * as materials from '../utils/materials.js';

export function createWindMassDamper(THREE) {
    const group = new THREE.Group();
    group.name = "WindMassDamper";

    const structureMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.5 });
    const massMat = materials.highlight || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.3, roughness: 0.7 });
    const cableMat = materials.dark || new THREE.MeshStandardMaterial({ color: 0x222222 });

    // Building Structure (Top Floors)
    const frameGroup = new THREE.Group();
    
    const colGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    const positions = [
        [-2, 0, -2], [2, 0, -2],
        [-2, 0, 2], [2, 0, 2]
    ];
    positions.forEach(pos => {
        const col = new THREE.Mesh(colGeo, structureMat);
        col.position.set(pos[0], 3, pos[2]);
        frameGroup.add(col);
    });
    
    const beamGeoX = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    beamGeoX.rotateZ(Math.PI / 2);
    const beamGeoZ = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    beamGeoZ.rotateX(Math.PI / 2);
    
    [0, 6].forEach(y => {
        const b1 = new THREE.Mesh(beamGeoX, structureMat); b1.position.set(0, y, -2);
        const b2 = new THREE.Mesh(beamGeoX, structureMat); b2.position.set(0, y, 2);
        const b3 = new THREE.Mesh(beamGeoZ, structureMat); b3.position.set(-2, y, 0);
        const b4 = new THREE.Mesh(beamGeoZ, structureMat); b4.position.set(2, y, 0);
        frameGroup.add(b1, b2, b3, b4);
    });
    
    group.add(frameGroup);

    // Tuned Mass Damper (Pendulum)
    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.set(0, 6, 0); // Suspended from top center
    
    const mass = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), massMat);
    mass.position.y = -4;
    pendulumGroup.add(mass);
    
    // Suspension Cables
    const cableGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    cableGeo.translate(0, -2, 0); 
    const centralCable = new THREE.Mesh(cableGeo, cableMat);
    pendulumGroup.add(centralCable);

    group.add(pendulumGroup);

    // Animation: Wind induces sway, pendulum lags and dampens
    const times = [];
    const buildingSway = [];
    const buildingRot = [];
    const pendulumSway = [];
    
    const duration = 10;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        times.push(t);
        
        // Building sways under wind load
        const swayVal = Math.sin(t * Math.PI * 0.5) * 0.8;
        buildingSway.push(0, 0, swayVal);
        
        // Building slight rotation
        const rotQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(t * Math.PI * 0.5) * 0.05, 0, 0));
        buildingRot.push(rotQ.x, rotQ.y, rotQ.z, rotQ.w);
        
        // Pendulum opposes motion (out of phase)
        const penAngle = Math.sin(t * Math.PI * 0.5 + Math.PI) * 0.25;
        const penQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(penAngle, 0, 0));
        pendulumSway.push(penQ.x, penQ.y, penQ.z, penQ.w);
    }

    const buildingTrack = new THREE.VectorKeyframeTrack(frameGroup.uuid + '.position', times, buildingSway);
    const bldgRotTrack = new THREE.QuaternionKeyframeTrack(frameGroup.uuid + '.quaternion', times, buildingRot);
    const pendulumTrack = new THREE.QuaternionKeyframeTrack(pendulumGroup.uuid + '.quaternion', times, pendulumSway);

    const clip = new THREE.AnimationClip('WindDampening', duration, [buildingTrack, bldgRotTrack, pendulumTrack]);

    return { group, animationClips: [clip] };
}
