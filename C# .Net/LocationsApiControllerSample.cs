using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
	[Route("api/locations")]
	[ApiController]
	public class LocationsApiController : BaseApiController
	{
	
		private ILocationService _lService = null;
		private IAuthenticationService<int> _authService = null;

		public LocationsApiController(ILocationService service,
			ILogger<LocationsApiController> logger,
			IAuthenticationService<int> authenticationService) : base(logger)
		{
			_lService = service;
			_authService = authenticationService;
		}

	
		[HttpPost]
		public ActionResult<ItemResponse<int>> CreateLocation(LocationAddRequest model)
		{
			ObjectResult result = null;

			try
			{
				int userId = _authService.GetCurrentUserId();

				int id = _lService.AddLocation(model, userId);

				ItemResponse<int> response = new ItemResponse<int>() { Item = id };
				result = Created201(response);
			}
			catch (Exception e)
			{
				Logger.LogError(e.ToString());
				ErrorResponse response = new ErrorResponse(e.Message);

				result = StatusCode(500, response);
			}

			return result;
		}

		
		[HttpGet]
		public ActionResult<ItemResponse<Paged<Location>>> SelectAll(int pageIndex, int pageSize)
		{
			int code = 200;
			BaseResponse response = null;

			try
			{
				Paged<Location> page = _lService.SelectAll(pageIndex, pageSize);

				if (page == null)
				{
					code = 404;
					response = new ErrorResponse("Location not found.");
				}
				else
				{
					response = new ItemResponse<Paged<Location>> { Item = page };
				}
			}
			catch (Exception e)
			{
				code = 500;
				response = new ErrorResponse(e.Message);
				base.Logger.LogError(e.ToString());
			}
			return StatusCode(code, response);
		}
	

		[HttpGet("{id:int}")]
		public ActionResult<ItemResponse<Location>> GetById(int id)
		{
			ItemsResponse<Location> response = new ItemsResponse<Location>();

			int code = 200;
			BaseResponse errorResponse = null;

			try
			{
				Location location = _lService.GetById(id);

				if (location == null)
				{
					code = 404;
					errorResponse = new ErrorResponse("Location not found.");

					return NotFound404(errorResponse);
				}
				else
				{
					errorResponse = new ItemResponse<Location> { Item = location };
				}
			}
			catch (Exception e)
			{
				code = 500;
				errorResponse = new ErrorResponse("Internal Server Exception... " + e.Message);
			}

			return StatusCode(code, errorResponse);
		}
	

		[HttpGet("createdby/{createdby:int}")]
		public ActionResult<ItemResponse<Location>> GetByCreatedBy(int createdBy, int pageIndex, int pageSize)
		{
			ItemsResponse<Location> response = new ItemsResponse<Location>();

			int code = 200;
			BaseResponse errorResponse = null;

			try
			{
				Paged<Location> page = _lService.GetByCreatedBy(createdBy, pageIndex, pageSize);

				if (page == null)
				{
					code = 404;
					errorResponse = new ErrorResponse("Location not found.");

					return NotFound404(errorResponse);
				}
				else
				{
					errorResponse = new ItemResponse<Paged<Location>> { Item = page };
				}
			}
			catch (Exception e)
			{
				code = 500;
				errorResponse = new ErrorResponse("Internal Server Exception... " + e.Message);
			}

			return StatusCode(code, errorResponse);
		}
		

	
		[HttpPut("{id:int}")]
		public ActionResult<SuccessResponse> UpdateLocation(LocationUpdateRequest model)
		{
			int code = 200;
			BaseResponse response = null;

			try
			{
				int userId = _authService.GetCurrentUserId();
				_lService.Update(model, userId);

				response = new SuccessResponse();
			}
			catch (Exception e)
			{
				code = 500;
				response = new ErrorResponse(e.Message);
			}
			return StatusCode(code, response);
		}
		

	
		[HttpDelete("{id:int}")]
		public ActionResult<SuccessResponse> Delete(int id)
		{
			int code = 200;
			BaseResponse response = null;

			try
			{
				_lService.DeleteLocation(id);
				response = new SuccessResponse();
			}
			catch (Exception e)
			{
				code = 500;
				response = new ErrorResponse(e.Message);
			}
			return StatusCode(code, response);
		}
		

		#region Location Lookups
		
		[HttpGet("states")]
		public ActionResult<ItemsResponse<State>> SelectAll()
		{
			int code = 200;
			BaseResponse response = null;

			try
			{
				List<State> state = _lService.SelectAllStates();

				if (state == null)
				{
					code = 404;
					response = new ErrorResponse("Location not found.");
				}
				else
				{
					response = new ItemsResponse<State> { Items = state };
				}
			}
			catch (Exception e)
			{
				code = 500;
				response = new ErrorResponse(e.Message);
				base.Logger.LogError(e.ToString());
			}
			return StatusCode(code, response);
		}

		
		[HttpGet("locationtypes")]
		public ActionResult<ItemsResponse<LocationType>> SelectAllLocationTypes()
		{
			int code = 200;
			BaseResponse response = null;

			try
			{
				List<LocationType> locationType = _lService.SelectAllLocationTypes();

				if (locationType == null)
				{
					code = 404;
					response = new ErrorResponse("Location not found.");
				}
				else
				{
					response = new ItemsResponse<LocationType> { Items = locationType };
				}
			}
			catch (Exception e)
			{
				code = 500;
				response = new ErrorResponse(e.Message);
				base.Logger.LogError(e.ToString());
			}
			return StatusCode(code, response);
		}
		#endregion


	}


	


}

