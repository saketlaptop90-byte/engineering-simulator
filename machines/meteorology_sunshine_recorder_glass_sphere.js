import { colors, getMaterial } from '../utils/materials.js';

export function createSunshineRecorderGlassSphere(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Marble/Stone
    const baseGeometry = new THREE.BoxGeometry(1.2, 0.2, 1.2);
    const baseMaterial = getMaterial('stone', colors.darkGrey || 0x444444);
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(base);

    // Support Stand
    const standGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.5, 32);
    const stand = new THREE.Mesh(standGeometry, getMaterial('metallic', colors.brass || 0xb5a642));
    stand.position.y = 0.35;
    group.add(stand);

    // Bowl / Card holder
    const bowlGeometry = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI, 0, Math.PI / 2);
    const bowl = new THREE.Mesh(bowlGeometry, getMaterial('metallic', colors.brass || 0xb5a642));
    bowl.material.side = THREE.DoubleSide;
    bowl.rotation.x = Math.PI / 2;
    bowl.rotation.z = Math.PI / 2;
    bowl.position.y = 0.6;
    group.add(bowl);

    // Glass Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0,
        transmission: 1.0,
        ior: 1.5,
        thickness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const sphere = new THREE.Mesh(sphereGeometry, glassMaterial);
    sphere.position.y = 0.9;
    group.add(sphere);

    // Burn mark (animated)
    const burnGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 8);
    const burn = new THREE.Mesh(burnGeometry, getMaterial('plastic', colors.black));
    
    const burnPivot = new THREE.Group();
    burnPivot.position.y = 0.9;
    burnPivot.name = "BurnPivot";
    burnPivot.add(burn);
    
    burn.position.z = 0.68;
    burn.rotation.x = Math.PI / 2;
    
    group.add(burnPivot);

    // Simulated Sun Ray
    const rayGeometry = new THREE.CylinderGeometry(0.01, 0.05, 2, 8);
    const rayMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0.6 });
    const ray = new THREE.Mesh(rayGeometry, rayMaterial);
    ray.position.z = -1;
    ray.rotation.x = Math.PI / 2;
    
    const rayPivot = new THREE.Group();
    rayPivot.position.y = 0.9;
    rayPivot.name = "RayPivot";
    rayPivot.add(ray);
    group.add(rayPivot);

    // Animation: Sun moves across sky, burning a trace
    const duration = 12;
    const times = [0, duration];
    
    const startRot = Math.PI / 4;
    const endRot = -Math.PI / 4;
    
    const rayTrack = new THREE.NumberKeyframeTrack('RayPivot.rotation[y]', times, [startRot, endRot]);
    const burnTrack = new THREE.NumberKeyframeTrack('BurnPivot.rotation[y]', times, [startRot + Math.PI, endRot + Math.PI]);

    const clip = new THREE.AnimationClip('SunTracking', duration, [rayTrack, burnTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
