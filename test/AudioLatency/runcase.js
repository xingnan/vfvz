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
#	Zhou,weiwei	<weiweix.zhou@intel.com>

*/

// Global variables 
var numberOfCase = 0;
var caseArray = new Array();
var currentCase = 0;
var totalTime = 0;
var totalCount = 0;

// Add new test case here.
function init()
{
        //caseArray.push(new TestCase("Example test", 10, "runFakeTest"));
        caseArray.push(new TestCase("convolution", 10, "runConvolutionTest"));
        caseArray.push(new TestCase("DynamicsCompress", 10, "runDynamicscompressTest"));
        caseArray.push(new TestCase("Waveshaper", 20, "runWaveshaperTest"));
        caseArray.push(new TestCase("Filter", 20, "runFilterTest"));
        caseArray.push(new TestCase("ComplexTest", 10, "runComplexTest"));
        numberOfCase = caseArray.length;
}

// Base class of test case
function TestCase(description, count, exec)
{
	this.description = description;
	this.printedCount = count;
	this.exec = exec;
	this.value = -1;
	this.start = function()
	{
		if (count <= 0) 
                {
			$("iframe").attr("src","run.html?exec=runFakeTest&count=" + this.printedCount);
			return;
		}

                $("iframe").attr("src","run.html?exec=" + this.exec + "&count=" + this.printedCount);
		totalCount = count;
	};
}

// Select case to run
function runTestCase(number)
{
	console.log("run case:", number);
	currentCase = caseArray[number];
	currentCase.start();
}

// End of test
function end(totalTime)
{
	console.log("totalTime:" + totalTime);
	var avgvalue = totalTime / totalCount;
	currentCase.value = Math.round(avgvalue*100)/100;
	endCallback(currentCase);
}

function browser_check()
{
	var UA = navigator.userAgent.toLowerCase();
	var browerKernel = {
		isWebkit : function(){
			if(/webkit/i.test(UA)) return true;
				else return false;
		},
	}
	if(browerKernel.isWebkit()){
		return "";
	} else {
		return "Doesn't support this function now, please try webkit browser, Thanks!";
	}  
}