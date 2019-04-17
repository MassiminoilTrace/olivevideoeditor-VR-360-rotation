/*Olive GLSL effect to pan angles of VR 360 videos
    Copyright (C) 2019 Massimo Gismondi

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

uniform float h_angle;
uniform float v_angle;

void main(void) {
	vec2 uv;
	vec2 xy = vTexCoord;
	
	/*
	//Estraggo coordinate sferiche del punto
	float lambda = (xy.x-0.5)*M_PI*2;//tra pi greco e meno pigreco
	float fi = (xy.y-0.5)*M_PI;//tra -pi/2 e pi/2
	
	//Calcolo coordinate cartesiane xyz
	vec3 coord = vec3( cos(fi)*cos(lambda) , cos(fi)*sin(lambda) , sin(lambda) );
	
	//Applico rotazioni che mi servono con matrici
	h_angle = h_angle/360*(2*M_PI);
	v_angle = v_angle/180*(M_PI);
	mat3 m_rot = mat3(
	cos(h_angle), sin(h_angle), 0,
	-sin(h_angle), cos(h_angle), 0,
	0,0,1
	);
 	coord = m_rot*coord;
	
	//Torno alle coordinate sferiche e, da lì, alle uv
	l
	
	*/
	
	//Riscrivo rimanendo in quelle sferiche
	float lambda = xy.x*M_PI*2;
	float fi = xy.y*M_PI;//Possibile errore di allineamento dell'equatore, da verificare.
	//Ora va da 0 a pigreco
	
	//Ruoto
	lambda = mod(lambda-h_angle/360, M_PI*2);
	float fi_cercato = fi - v_angle/90;
	float fi_cercato_mod = mod(fi_cercato, M_PI);//Confinato con modulo tra 0 e PI
	if (fi_cercato!=fi_cercato_mod)//Nel caso dovessi ruotare
	{
        fi_cercato = M_PI - fi_cercato_mod;
        lambda = lambda+M_PI;
	}
	
    uv.x = mod(xy.x - h_angle/360.0, 1);
    uv.y = mod(fi_cercato, M_PI)/M_PI;
	vec4 c = texture2D(tex0, uv);
	gl_FragColor = c;
}
