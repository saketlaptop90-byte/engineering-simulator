export const chem_c_mwcnt = {
    id: 'chem_c_mwcnt',
    name: 'Carbon - MWCNT',
    type: 'chemistry',
    category: 'Chemistry',
    price: 75000,
    description: 'Multi-Walled Carbon Nanotube (MWCNT). Concentric cylinders of graphene exhibiting unique electronic and mechanical properties.',
    particles: '300 carbon atoms arranged in nested cylindrical graphene structures',
    connections: 'Intra-cylinder sp2 covalent bonds and inter-cylinder Van der Waals interactions',
    isPremium: true,
    
    // Core Engine Integration
    init: function(engine) {
        this.engine = engine;
        this.particles = [];
        this.constraints = [];
        this.createStructure();
    },

    createStructure: function() {
        // God-Tier ultra-detailed geometry generation
        const count = parseInt(this.particles.match(/\d+/)[0]) || 100;
        const radius = 80;
        const cx = 400, cy = 300;
        
        for (let i = 0; i < count; i++) {
            // Golden spiral volumetric distribution for aesthetic layout
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            
            const r = radius * (1 + 0.3 * Math.sin(theta * 4));
            
            const x = r * Math.sin(phi) * Math.cos(theta) + cx;
            const y = r * Math.sin(phi) * Math.sin(theta) + cy;
            
            // Differentiate oxygen and carbon for Graphene Oxide
            let isOxygen = (this.id === 'chem_c_graphene_oxide' && i > count - 50);
            
            const particle = this.engine.addParticle(x, y, {
                mass: isOxygen ? 15.999 : 12.011,
                radius: isOxygen ? 5 : 6,
                restitution: 0.85,
                friction: 0.05,
                color: isOxygen ? '#ff3333' : '#3b3b3b',
                label: isOxygen ? 'O' : 'C',
                element: isOxygen ? 'Oxygen' : 'Carbon'
            });
            
            // Ultra-smooth organic initial velocities
            particle.vx = (Math.random() - 0.5) * 0.2;
            particle.vy = (Math.random() - 0.5) * 0.2;
            
            this.particles.push(particle);
        }
        
        // Advanced distance-based dynamic bonding
        const connectThreshold = this.id === 'chem_c_carbyne' ? 30 : 45;
        
        for (let i = 0; i < this.particles.length; i++) {
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Form bonds for nearby atoms to simulate crystal/chain structure
                if (dist < connectThreshold && connections < 4) {
                    const isTriple = (this.id === 'chem_c_carbyne' && i % 2 === 0);
                    const bond = this.engine.addConstraint(p1, p2, {
                        stiffness: 0.9,
                        damping: 0.05,
                        length: dist,
                        color: isTriple ? 'rgba(255, 100, 255, 0.6)' : 'rgba(0, 255, 255, 0.4)',
                        width: isTriple ? 3 : 1.5
                    });
                    this.constraints.push(bond);
                    connections++;
                }
            }
        }
    },
    
    update: function(dt) {
        // God tier ambient rotation, vibration, and interaction physics
        const time = Date.now() * 0.001;
        const cx = 400, cy = 300;
        
        this.particles.forEach((p, i) => {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Complex centripetal force field for 3D illusion
            if (dist > 20) {
                p.vx -= (dx / dist) * 0.08 * (1 + 0.2 * Math.sin(time + i));
                p.vy -= (dy / dist) * 0.08 * (1 + 0.2 * Math.cos(time + i));
            }
            
            // Harmonic thermal vibration (phonons)
            p.vx += Math.sin(time * 3 + i * 0.1) * 0.15;
            p.vy += Math.cos(time * 3 + i * 0.1) * 0.15;
            
            // Add subtle twist for nanotube/fullerene structures
            if (this.id.includes('mwcnt') || this.id.includes('fullerene')) {
                p.vx += (dy / dist) * 0.2;
                p.vy -= (dx / dist) * 0.2;
            }
        });
    },

    draw: function(ctx) {
        // Render ultra-high quality cinematic connections (electron density clouds)
        ctx.beginPath();
        this.constraints.forEach(c => {
            ctx.moveTo(c.p1.x, c.p1.y);
            ctx.lineTo(c.p2.x, c.p2.y);
        });
        ctx.strokeStyle = this.id === 'chem_c_carbyne' ? 'rgba(255, 100, 255, 0.3)' : 'rgba(0, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Render atoms with premium God Tier 3D volumetric glow
        this.particles.forEach(p => {
            const isOxygen = p.label === 'O';
            const baseColor = isOxygen ? '#ff3333' : '#00ffff';
            const shadowColor = isOxygen ? '#880000' : '#005555';
            
            const gradient = ctx.createRadialGradient(p.x - p.radius*0.2, p.y - p.radius*0.2, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, isOxygen ? '#ff8888' : '#ffffff');
            gradient.addColorStop(0.3, isOxygen ? '#cc0000' : '#444444');
            gradient.addColorStop(1, '#000000');
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Outer electron cloud glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = isOxygen ? 'rgba(255, 50, 50, 0.1)' : 'rgba(0, 255, 255, 0.05)';
            ctx.fill();
            
            // Element Label
            ctx.fillStyle = baseColor;
            ctx.font = '7px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, p.x, p.y);
        });
    }
};
