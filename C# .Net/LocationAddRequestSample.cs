using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests
{
	public class LocationAddRequest
	{
	
	
		[Required, Range(1, Int32.MaxValue) ]
		public int LocationTypeId { get; set; }

		[Required, StringLength(255)]
		public string LineOne { get; set; }
		
		public string LineTwo { get; set; }
		[Required]
		public string City { get; set; }
		
		public string Zip { get; set; }
		[Required, Range(1, Int32.MaxValue)]
		public int StateId { get; set; }
		[Required, Range(-90, 90)]
		public double Latitude { get; set; }
		[Required, Range(-180, 180)]
		public double Longitude { get; set; }
		[Required, Range(1, Int32.MaxValue)]
		public int StatusId { get; set; }
	}
}
