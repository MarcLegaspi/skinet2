using API.Extensions;
using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
            //  Configuration = configuration;
        }

        /// public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddControllers();
            services.AddDbContext<StoreContext>(x =>
                x.UseSqlite(_configuration.GetConnectionString("DefaultConnection")));
        
            services.AddDbContext<AppIdentityDbContext>(x =>
                x.UseSqlite(_configuration.GetConnectionString("IdentityConnection")));

            services.AddApplicationServices();
            services.AddIdentityServices(_configuration);
            services.AddSwaggerDocumentation();

            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            // if (env.IsDevelopment())
            // {
            //     //      app.UseDeveloperExceptionPage();
            //     app.UseSwagger();
            //     app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            // }

            app.UseStatusCodePagesWithReExecute("/errors/{0}");
            app.UseSwaggerDocumentation();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseStaticFiles();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
