/*Olive GLSL effect to pan angles of VR 360 videos
    Copyright © 2019 Massimo Gismondi

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
#version 120
uniform sampler2D tex0;
varying vec2 vTexCoord;
#define M_PI 3.1415926535897932384626433832795

uniform float angle_x_axis;
uniform float angle_y_axis;
uniform float angle_z_axis;

void main(void) {
	vec2 uv;
	vec2 xy = vTexCoord;
	
	
	//Riscrivo rimanendo in quelle sferiche
	float lambda = xy.x*M_PI*2;//Va da 0 a 2pi
	float fi = (xy.y-0.5)*M_PI;//Va da -pi/2 a pi/2
	
	//Traslo per avere origine a centro immagine, si può togliere nel caso fosse errato
	
	//Passo a cartesiane per semplificare le rotazioni con le matrici
	vec3 coord = vec3( cos(fi)*cos(lambda), cos(fi)*sin(lambda) , sin(fi) );
	
	//
	//Rotazioni e matrici
	//1) converto da gradi a radianti
	float angle_x = (angle_x_axis/360)*M_PI*2;
	float angle_y = (angle_y_axis/360)*M_PI*2;
	float angle_z = (angle_z_axis/360)*M_PI*2;
	
	//2)Istanzio matrici
	mat3 mat_rot_x = mat3(
	1,0,0,
	0,cos(angle_x),sin(angle_x),
	0,-sin(angle_x),cos(angle_x)
	);
	
	mat3 mat_rot_y = mat3(
	cos(angle_y),0,-sin(angle_y),
	0,1,0,
	sin(angle_y),0,cos(angle_y)
	);
	
	mat3 mat_rot_z = mat3(
	cos(angle_z),sin(angle_z),0,
	-sin(angle_z),cos(angle_z),0,
	0,0,1
	);
	
	coord = mat_rot_y*mat_rot_z*mat_rot_x*coord;
	
	//Torno a coordinate sferiche sovrascrivendo le precedenti
	fi = asin(coord.z);//Tra -pi/2 e +pi/2
	lambda = acos(coord.x/sqrt(coord.x*coord.x + coord.y*coord.y));
	if (coord.y<0)
	{
        lambda = -lambda;//Tengo conto di quale lato cado con le coordinate sul piano XY rispetto al XZ
	}
	
	fi = fi/(M_PI/2);
	fi = (fi+1)/2;//Ora è tra 0 e 1
	
	lambda = mod(lambda, M_PI*2)/(M_PI*2);//Anche lui tra 0 e 1
	
	
    uv.x = lambda;
    uv.y = fi;
	vec4 c = texture2D(tex0, uv);
	gl_FragColor = c;
	
	//A scopo di debug mostro le coord cartesiane calcolate rinormalizzate tra 0 e 1
	//gl_FragColor = vec4(coord.x/2+0.5, coord.y/2+0.5, coord.z/2+0.5, 1);
}
