/*

#  Copyright (C) 2011 Intel Corporation
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 2
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
#  Authors:
#	Wu, Dawei	<daweix.wu@intel.com>
#	Wang, xingnan	<xingnan.wang@intel.com>
#	Li Min		<min.a.li@intel.com>	

*/



// Global settings
var sampleRate = 44100;
var lengthInSeconds = 3;
var numberOfRenderFrames = sampleRate * lengthInSeconds;
var globalNumberOfChannels = 1;

// Global variables 
var totalTime = 0;
var totalCount = 0;
var context = 0;
var globalSourceBuffer = 0;

// Test configuration
var url_mode = 0;
var url = window.location.href;
var len = url.length;
var url_offset = url.indexOf("?");
var url_para = url.substr(url_offset,len);
var url_string_arr = url_para.split("&");
var exec_function = (url_string_arr[0].split("="))[1];
var exec_count = (url_string_arr[1].split("="))[1];
var count = exec_count;


//WebAudio context init
function init()
{
	numberOfChannels = 1;
	context = new OfflineAudioContext(globalNumberOfChannels, numberOfRenderFrames, sampleRate);
	globalSourceBuffer = context.createBuffer(globalNumberOfChannels, numberOfRenderFrames, context.sampleRate);

}

//Run WebAudio
function runWebAudio()
{
	console.log("run case:", exec_function);
	console.log("internal start l");
	eval(exec_function+"()");
}

//Example test
function runFakeTest()
{
	// Create audio context
	var context = getAudioContext();
	var source = context.createBufferSource();

	// create audio buffer
        source.buffer = getAudioBuffer(context);
        source.connect(context.destination);
        source.noteOn(0);

	// start the case
        startRender();
}

function getAudioBuffer(audiocontext)
{
	var buffer = 0;
	if (audiocontext != context)
		buffer = audiocontext.createBuffer(numberOfChannels, numberOfRenderFrames, audiocontext.sampleRate);
	else
		buffer = globalSourceBuffer;

	for (var n = 0; n < numberOfChannels; n++)
	{
		var data = buffer.getChannelData(n);
			for (var i = 0; i < numberOfRenderFrames; ++i) {
        	var x = i*n / numberOfRenderFrames; 
        	x = 2 * x - 1 + n / i; 
        	data[i] = x;
    	}
	}
	return buffer;
}

function startRender()
{
	context.oncomplete = complete;
	start_time = Date.now();
	context.startRendering();
}

function complete()
{
	var end_time = Date.now();
	console.log("end_time:" + end_time);
	totalTime += end_time - start_time;
	delete context;
	if (--count)
		eval(exec_function+"()");
	else
		end();	
}

function end()
{
	console.log("totalTime:" + totalTime);
	console.log("internal end l");
	window.parent.end(totalTime);
}

function getAudioContext(localNumberOfChannels, localNumberOfRenderFrames, localSampleRate)
{
	if (localNumberOfChannels == undefined)
		localNumberOfChannels = globalNumberOfChannels;
	if (localNumberOfRenderFrames == undefined)
		localNumberOfRenderFrames = numberOfRenderFrames;
	if (localSampleRate == undefined)
		localSampleRate = sampleRate;
        //if (!context)
		context = new OfflineAudioContext(localNumberOfChannels, localNumberOfRenderFrames, localSampleRate);
	return context;
}

//Test Case: Convolution

function runConvolutionTest()
{
        var context=getAudioContext();
        var bufsource=context.createBufferSource();
        var convolver=context.createConvolver();
        var gainNode1=context.createGainNode();
        var gainNode2=context.createGainNode();

        bufsource.connect(gainNode1);
        gainNode1.connect(context.destination);
        bufsource.connect(convolver);
        convolver.connect(gainNode2);
        gainNode2.connect(context.destination);
        bufsource.buffer=getAudioBuffer(context);
        convolver.buffer=getAudioBuffer(context);
        gainNode1.gain.value=0.5;
        gainNode2.gain.value=0.5;
        bufsource.noteOn(0);
        startRender();
                
}

//Test Case: Filter
function runFilterTest()
{
        var context=getAudioContext();
        var bufsource=context.createBufferSource();
        var biquadfilternode=context.createBiquadFilter();
        
        biquadfilternode.type=0;
        biquadfilternode.frequency.value=200;
        gainNode=context.createGainNode();
        gainNode.gain.value=0.5;
        bufsource.connect(gainNode);
        gainNode.connect(biquadfilternode);
        biquadfilternode.connect(context.destination);
        bufsource.buffer=getAudioBuffer(context);
        bufsource.noteOn(0);
        startRender();
}

//Test Case: DynamicsCompress
function runDynamicscompressTest()
{
        var context=getAudioContext();
	var bufsource=context.createBufferSource();
	var dynamicsCompressorNode=context.createDynamicsCompressor();
	var gainNode=context.createGainNode();
	
        gainNode.gain.value=0.5;
	bufsource.connect(gainNode);
        gainNode.connect(dynamicsCompressorNode);
	dynamicsCompressorNode.connect(context.destination);
	bufsource.buffer=getAudioBuffer(context);
        bufsource.noteOn(0);
        startRender();
}

//Test Case: WaveShaper
function runWaveshaperTest()
{
        var context=getAudioContext();
	var bufsource=context.createBufferSource();
	var waveShaperNode=context.createWaveShaper();
	waveShaperNode.curve=0.9;
	var gainNode=context.createGainNode();
	
        gainNode.gain.value=0.5;
	bufsource.connect(gainNode);
	gainNode.connect(waveShaperNode);
	waveShaperNode.connect(context.destination);
	bufsource.buffer=getAudioBuffer(context);
	bufsource.noteOn(0);
        startRender();
}


//Test Case: Complex test
function runComplexTest()
{
 	var context=getAudioContext();
	var bufsource=context.createBufferSource();
	var dynamicsCompressorNode=context.createDynamicsCompressor();
	var waveShaperNode=context.createWaveShaper();
	waveShaperNode.curve=0.9;
	var biquadLowPassFilternode=context.createBiquadFilter();
	biquadLowPassFilternode.type=0;
	biquadLowPassFilternode.frequency.value = 200;
	var gainNode=context.createGainNode();
	gainNode.gain.value=0.5;
	
        bufsource.connect(gainNode);
	gainNode.connect(biquadLowPassFilternode);
	biquadLowPassFilternode.connect(dynamicsCompressorNode);
	dynamicsCompressorNode.connect(waveShaperNode);
	waveShaperNode.connect(context.destination);
	
	bufsource.buffer=getAudioBuffer(context);
        bufsource.noteOn(0);
        startRender();	       
}

